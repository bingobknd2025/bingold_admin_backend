const { Op } = require("sequelize");
const { PdaUser, Role, Permission, PdaUserToken, Otp } = require("../models");
const Hash = require("../utils/hash.util");
const ApiError = require("../utils/apiError.util");
const TokenService = require("./token.service");
const OtpService = require("./otp.service");
const EmailService = require("../services/email.service");
const { otpTemplate } = require("../templates/emails/otp.template");
const speakeasy = require("speakeasy");
class AuthService {

  async register(name, email, password) {
    const existingUser = await PdaUser.findOne({ where: { email } });

    if (existingUser) {
      throw new ApiError(409, "Email already in use");
    }

    const hashedPassword = await Hash.hashPassword(password);

    return PdaUser.create({
      name,
      email,
      password: hashedPassword,
      is_active: 1,
    });
  }

  async login(email, password) {
    const user = await PdaUser.findOne({
      where: { email, is_active: 1 },
    });

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const validPassword = await Hash.comparePassword(password, user.password);
    if (!validPassword) {
      throw new ApiError(401, "Invalid credentials");
    }

    // OTP setup required
    if (!user.otp_enabled) {
      const otp = await OtpService.generateSecret(user.email);
      user.otp_secret = otp.base32;
      await user.save();

      return {
        success: true,
        otp_required: true,
        setup_required: true,
        qr_code: otp.qr,
        secret: otp.base32,
        message: "Scan QR code with Google Authenticator to setup OTP",
      };
    }

    return {
      success: true,
      otp_required: true,
      setup_required: false,
      message: "Enter OTP from your authenticator app",
    };
  }

  async verifyOtp(email, otp, req, type, method) {
    const user = await PdaUser.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: "user_role",
          attributes: ["id", "name", "slug"],
          include: [
            {
              model: Permission,
              as: "permissions",
              attributes: ["id", "name", "slug"],
              through: { attributes: [] }
            }
          ]
        }
      ]
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const otpType = type || OtpService.OTP_TYPES.LOGIN;
    const otpMethod = method || OtpService.OTP_METHODS.TOTP;

    const valid = await OtpService.verify({
      customerId: user.id,
      type: otpType,
      method: otpMethod,
      token: otp,
      secret: user.otp_secret,
    });
    if (!valid) {
      throw new ApiError(400, "Invalid OTP");
    }

    const permissions = user.user_role
      ? user.user_role.permissions.map(p => p.slug)
      : [];

    const accessToken = TokenService.accessToken({
      pda_user_id: user.id,
      role_id: user.role_id,
      role: user.user_role?.slug,
      permissions
    });

    const refreshToken = TokenService.refreshToken();

    await PdaUserToken.create({
      pda_user_id: user.id,
      refresh_token_hash: TokenService.hashToken(refreshToken),
      device_id: req.headers["x-device-id"] || null,
      ip_address: req.ip,
      user_agent: req.headers["user-agent"],
      expires_at: new Date(Date.now() + 14 * 86400000),
    });

    user.otp_enabled = true;
    user.last_login_at = new Date();

    await user.save();

    return {
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.user_role?.slug,
        permissions
      },
      message: "Login successful",
    };
  }

  async setupOtp(email) {
    const user = await PdaUser.findOne({ where: { email } });
    if (!user) throw new ApiError(404, "User not found");

    if (user.otp_enabled) {
      throw new ApiError(400, "OTP already enabled");
    }

    const otpData = await OtpService.generateSecret(email);

    user.otp_secret = otpData.base32;
    user.otp_enabled = false;
    await user.save();

    return {
      qrCode: otpData.qr,
      secret: otpData.base32,
      message: "Scan QR code with Google Authenticator",
    };
  }

  async refreshToken(refreshToken, req) {
    const hashedToken = TokenService.hashToken(refreshToken);

    const tokenRecord = await PdaUserToken.findOne({
      where: {
        refresh_token_hash: hashedToken,
        revoked_at: null,
        expires_at: { [Op.gt]: new Date() },
      },
      include: [{
        model: PdaUser,
        as: 'user'   // 👈 REQUIRED
      }],
    });

    if (!tokenRecord || !tokenRecord.user) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    tokenRecord.revoked_at = new Date();
    await tokenRecord.save();

    const user = tokenRecord.user;

    const newAccessToken = TokenService.accessToken({
      pda_user_id: user.id,
      role: user.role,
      email: user.email,
    });

    const newRefreshToken = TokenService.refreshToken();

    await PdaUserToken.create({
      pda_user_id: user.id,
      refresh_token_hash: TokenService.hashToken(newRefreshToken),
      device_id: req.headers["x-device-id"] || null,
      ip_address: req.ip,
      user_agent: req.headers["user-agent"],
      expires_at: new Date(Date.now() + 14 * 86400000),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }


  async logout(refreshToken) {
    const hashedToken = TokenService.hashToken(refreshToken);

    const tokenRecord = await PdaUserToken.findOne({
      where: { refresh_token_hash: hashedToken },
    });

    if (tokenRecord) {
      tokenRecord.revoked_at = new Date();
      await tokenRecord.save();
    }

    return true;
  }

  async logoutAll(userId) {
    await PdaUserToken.update(
      { revoked_at: new Date() },
      {
        where: {
          pda_user_id: userId,
          revoked_at: null,
          expires_at: { [Op.gt]: new Date() },
        },
      }
    );

    return true;
  }

  /* ================= SESSIONS ================= */
  async getSessions(userId) {
    return PdaUserToken.findAll({
      where: {
        pda_user_id: userId,
        revoked_at: null,
        expires_at: { [Op.gt]: new Date() },
      },
      attributes: [
        "id",
        "device_id",
        "ip_address",
        "user_agent",
        "created_at",
        "expires_at",
      ],
    });
  }

  async forgotPassword(email) {
    const user = await PdaUser.findOne({ where: { email } });
    if (!user) throw new ApiError(404, "User not found");

    const otp = OtpService.generateNumericOtp(6);

    await OtpService.saveOtp({
      customerId: user.id,
      type: OtpService.OTP_TYPES.FORGOT_PASSWORD,
      otp,
      expiresInMinutes: 2,
    });


    await EmailService.sendEmail({
      to: user.email,
      subject: "Password Reset OTP",
      html: otpTemplate({
        name: user.name,
        otp,
      }),
    });

    return {
      success: true,
      message: "OTP sent successfully",
    };
  }

async resetPassword(userId, newPassword) {

  const user = await PdaUser.findByPk(userId);
  if (!user) throw new ApiError(404, "User not found");

  const isSamePassword = await Hash.comparePassword(newPassword, user.password);
  if (isSamePassword) {
    throw new ApiError(400, "New password cannot be the same as the current password");
  }

  const hashedPassword = await Hash.hashPassword(newPassword);

  await user.update({ password: hashedPassword });

  return true;
}


async requestChangePasswordOtp(userId, oldPassword, method) {

  const user = await PdaUser.findByPk(userId);
  if (!user) throw new ApiError(404, "User not found");

  const validPassword = await Hash.comparePassword(oldPassword, user.password);
  if (!validPassword) {
    throw new ApiError(400, "Old password is incorrect");
  }

  const otp = OtpService.generateNumericOtp(6);

  await OtpService.saveOtp({
    customerId: user.id,
    type: OtpService.OTP_TYPES.CHANGE_PASSWORD,
    method: method || OtpService.OTP_METHODS.EMAIL,
    otp,
    expiresInMinutes: 2,
  });

  await EmailService.sendEmail({
    to: user.email,
    subject: "Change Password OTP",
    html: otpTemplate({
      name: user.name,
      otp,
    }),
  });

  return {
    success: true,
    message: "OTP sent successfully",
  };
}

async confirmChangePassword(userId, otp, newPassword, method) {

  const user = await PdaUser.findByPk(userId);
  if (!user) throw new ApiError(404, "User not found");

  const valid = await OtpService.verify({
    customerId: user.id,
    type: OtpService.OTP_TYPES.CHANGE_PASSWORD,
    method: method || OtpService.OTP_METHODS.EMAIL,
    token: otp,
  });

  if (!valid) throw new ApiError(400, "Invalid OTP");

  /* check new password should not be same as old password */
  const isSamePassword = await Hash.comparePassword(newPassword, user.password);
  if (isSamePassword) {
    throw new ApiError(400, "New password cannot be the same as the current password");
  }

  const hashedPassword = await Hash.hashPassword(newPassword);

  await user.update({ password: hashedPassword });

  return {
    success: true,
    message: "Password changed successfully",
  };
}

async regenerateAuthenticator(userId) {
  const user = await PdaUser.findByPk(userId);
  if (!user) throw new ApiError(404, "User not found");
  const otp = await OtpService.generateSecret(user.email);
  user.otp_secret = otp.base32;

  await user.save();

  return {
    success: true,
    otp_required: true,
    setup_required: true,
    qr_code: otp.qr,
    secret: otp.base32,
    message: "Scan QR code with Google Authenticator to setup OTP",
  };
}

}

module.exports = new AuthService();
