// routes/auth.routes.js
const router = require("express").Router();
const c = require("../controllers/auth.controller");

const authToken = require("../middleware/auth.middleware");

const {
  otpLimiter,
  loginLimiter,
  speedLimiter,
} = require("../middleware/security.middleware");

router.post("/register", c.register);
console.log("Before login route Route calling");
router.post("/login", loginLimiter, speedLimiter, c.login);
console.log("After login route Route calling");

router.post("/verify-otp", otpLimiter, speedLimiter, c.verifyOtp);
router.post("/forgot-password", otpLimiter, speedLimiter, c.forgotPassword);
router.post("/reset-password", authToken, c.resetPassword);
router.post("/change-password/request-otp", authToken, otpLimiter, speedLimiter, c.requestChangePasswordOtp);
router.post("/change-password/confirm", authToken, speedLimiter, c.confirmChangePassword);
router.post("/regenerate-authenticator", authToken, speedLimiter, c.regenerateAuthenticator);
router.post("/setup-otp", c.setupOtp);
router.post("/refresh-token", c.refreshToken);
router.post("/logout", authToken, c.logout);
router.post("/logout-all", authToken, c.logoutAll);
router.get("/sessions", authToken, c.getSessions);

module.exports = router;
