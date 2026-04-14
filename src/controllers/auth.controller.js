const AuthService = require("../services/auth.service");

exports.register = async (req, res, next) => {
  console.log("REGISTER API HIT");
  try {
    const user = await AuthService.register(
      req.body.name,
      req.body.email,
      req.body.password
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const response = await AuthService.login(req.body.email, req.body.password);
    res.json(response);
  } catch (e) {
    next(e);
  }
};

exports.setupOtp = async (req, res, next) => {
  try {
    const response = await AuthService.setupOtp(req.body.email);
    res.json(response);
  } catch (e) {
    next(e);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const tokens = await AuthService.verifyOtp(
      req.body.email,
      req.body.otp,
      req,
      req.body.type,    
      req.body.method
    );

    res.json({
      success: true,
      message: "OTP verified successfully",
      data: tokens
    });
  } catch (e) {
    next(e);
  }
};


exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await AuthService.refreshToken(refreshToken, req);
    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: tokens
    });
  } catch (e) {
    next(e);
  }
};

exports.logout = async (req, res, next) => {
  try {
    await AuthService.logout(req.body.refreshToken);
    res.json({ success: true, message: "Logged out successfully" });
  } catch (e) {
    next(e);
  }
};

exports.logoutAll = async (req, res, next) => {
  try {
    const userId = req.user.pda_user_id;
    await AuthService.logoutAll(userId);
    res.json({ success: true, message: "Logged out from all devices" });
  } catch (e) {
    next(e);
  }
};

exports.getSessions = async (req, res, next) => {
  try {
    const userId = req.user.pda_user_id;
    const sessions = await AuthService.getSessions(userId);
    res.json(sessions);
  } catch (e) {
    next(e);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const userId = req.user.pda_user_id;
    await AuthService.resetPassword(userId, req.body.newPassword);

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (e) {
    next(e);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const result = await AuthService.forgotPassword(req.body.email);
    res.json(result);
  } catch (e) {
    next(e);
  }
};

exports.requestChangePasswordOtp = async (req, res, next) => {
  try {
    const userId = req.user.pda_user_id;

    const result = await AuthService.requestChangePasswordOtp(
      userId,
      req.body.oldPassword,
      req.body.method
    );

    res.json(result);
  } catch (e) {
    next(e);
  }
};

exports.confirmChangePassword = async (req, res, next) => {
  try {
    const userId = req.user.pda_user_id;

    const result = await AuthService.confirmChangePassword(
      userId,
      req.body.otp,
      req.body.newPassword,
      req.body.method
    );

    res.json(result);
  } catch (e) {
    next(e);
  }
};

exports.regenerateAuthenticator = async (req, res, next) => {
  try {
    const result = await AuthService.regenerateAuthenticator(
      req.user.pda_user_id
    );

    res.json(result);
  } catch (e) {
    next(e);
  }
};


