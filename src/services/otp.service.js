// services/otp.service.js

const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const crypto = require("crypto");
const { Otp } = require("../models");


const OTP_TYPES = {
  LOGIN: "LOGIN",
  REGISTER: "REGISTER",
  CHANGE_PASSWORD: "CHANGE_PASSWORD",
  FORGOT_PASSWORD: "FORGOT_PASSWORD",
};

const OTP_METHODS = {
  TOTP: "TOTP",
  EMAIL: "EMAIL",
  SMS: "SMS",
};


exports.generateSecret = async (email) => {
  const secret = speakeasy.generateSecret({
    length: 20,
    name: `Bingold Admin (${email})`,
    issuer: "Bingold Admin",
  });

  console.log(
    `[OTP] Generated secret for ${email}: ${secret.base32.substring(0, 10)}...`
  );

  return {
    base32: secret.base32,
    qr: await QRCode.toDataURL(secret.otpauth_url),
    otpauth_url: secret.otpauth_url,
  };
};



exports.generateNumericOtp = (length = 6) => {
  return crypto.randomInt(10 ** (length - 1), 10 ** length);
};

exports.saveOtp = async ({
  customerId,
  type,
  otp,
  expiresInMinutes = 2,
}) => {
  if (!OTP_TYPES[type]) throw new Error("Invalid OTP type");

  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  const existingOtp = await Otp.findOne({
    where: {
      customer_id: customerId,
      type,
    },
    order: [["updated_at", "DESC"]],
  });

  if (existingOtp) {
    const now = new Date();
    const minutesSinceLastOtp =
      (now - new Date(existingOtp.updated_at)) / (1000 * 60);
    if (existingOtp.attempt_count >= 5 && minutesSinceLastOtp < 30) {
      throw new Error("Maximum OTP attempts reached. Try again after some time.");
    }

    if (minutesSinceLastOtp >= 30) {
      existingOtp.attempt_count = 0;
    }

    existingOtp.otp = String(otp);
    existingOtp.expires_at = expiresAt;
    existingOtp.attempt_count += 1;

    await existingOtp.save();
    return existingOtp;
  }

  return await Otp.create({
    customer_id: customerId,
    type,
    otp: String(otp),
    expires_at: expiresAt,
    attempt_count: 1,
  });
};

exports.getLatestOtp = async ({ customerId, type }) => {
  return await Otp.findOne({
    where: {
      customer_id: customerId,
      type,
    },
    order: [["created_at", "DESC"]],
  });
};


exports.deleteOtp = async ({ customerId, type }) => {
  return await Otp.destroy({
    where: {
      customer_id: customerId,
      type,
    },
  });
};

exports.verify = async ({
  customerId,
  type,
  method,
  token,
  secret,
}) => {

  if (!OTP_TYPES[type]) {
    throw new Error("Invalid OTP type");
  }

  if (!OTP_METHODS[method]) {
    throw new Error("Invalid OTP method");
  }

  if (method === OTP_METHODS.TOTP) {
    if (!secret) {
      return false;
    }

    try {
      const valid = speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token,
        window: 2,
      });

      return valid;
    } catch (error) {
      console.log(`[OTP VERIFY - TOTP] Error:`, error.message);
      return false;
    }
  }

  if (
    method === OTP_METHODS.EMAIL ||
    method === OTP_METHODS.SMS
  ) {
    try {
      const otpRecord = await exports.getLatestOtp({
        customerId,
        type,
        method,
      });

      if (!otpRecord) {
        return false;
      }
      if (new Date() > new Date(otpRecord.expires_at)) {
        return false;
      }

      const isValid = String(otpRecord.otp) === String(token);

      if (isValid) {
        await exports.deleteOtp({
          customerId,
          type,
        });
      }

      return isValid;
    } catch (error) {
      console.log(`[OTP VERIFY] Error:`, error.message);
      return false;
    }
  }

  return false;
};

exports.getCurrentToken = (secret) => {
  return speakeasy.totp({
    secret,
    encoding: "base32",
  });
};

exports.OTP_TYPES = OTP_TYPES;
exports.OTP_METHODS = OTP_METHODS;
