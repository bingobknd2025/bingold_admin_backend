// middleware/security.middleware.js
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 attempts
  message: "Too many OTP attempts. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 attempts
  message: "Too many login attempts. Account may be locked.",
  standardHeaders: true,
  legacyHeaders: false,
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayMs: 500,
  validate: {
    delayMs: false
  }
});

// Fixed tracking limiter - without trustProxy and with proper IP handling
const trackingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // 120 requests per minute
  message: "Too many location updates. Please slow down.",
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
  // Use the built-in IP key generator (don't use custom keyGenerator)
});

// If you need user-based limiting, use this approach:
const userBasedTrackingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: "Too many location updates. Please slow down.",
  standardHeaders: true,
  legacyHeaders: false,
  // Instead of custom keyGenerator, use a separate middleware
  skipFailedRequests: true,
});

module.exports = {
  otpLimiter,
  loginLimiter,
  speedLimiter,
  trackingLimiter,
  userBasedTrackingLimiter
};