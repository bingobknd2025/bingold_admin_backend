// routes/bingopay/customer.routes.js
//
// Customer-facing BingoPay surface. Mounted at /api/bingold/bingopay, behind the
// api-key middleware but BEFORE the admin JWT middleware. Auth/onboarding calls
// are open (the BinGold API itself authenticates); wallet calls require the
// caller's BinGold session token via the bingoldAuth middleware.
const router = require("express").Router();
const customerController = require("../../controllers/bingopay/customer.controller");
const walletController = require("../../controllers/bingopay/wallet.controller");
const bingoldAuth = require("../../middleware/bingoldAuth.middleware");

// ─── Auth / onboarding (SSO with BinGold) ────────────────────────
router.post("/auth/user-exists",
  /*  #swagger.tags = ['BingoPay - Customer Auth']
      #swagger.summary = 'Check if an email already has a BinGold account (and sync local mapping if it does)'
      #swagger.requestBody = { required: true, content: { "application/json": { schema: { type: 'object', required: ['email'], properties: { email: { type: 'string', example: 'john@example.com' } } } } } } */
  customerController.checkUser);

router.post("/auth/register",
  /*  #swagger.tags = ['BingoPay - Customer Auth']
      #swagger.summary = 'Register a new customer via BinGold external API (server-to-server, no OTP); stores shared uuid + returns a BinGold token'
      #swagger.requestBody = { required: true, content: { "application/json": { schema: { type: 'object', required: ['firstName','lastName','password','countryId','email','phoneNumber'], properties: { firstName: { type:'string', example:'John' }, lastName: { type:'string', example:'Doe' }, password: { type:'string', example:'Passw0rd@123', description:'Strong: 8+ chars incl. upper/lower/number/special' }, countryId: { type:'string', example:'91', description:'Dialing code' }, email: { type:'string', example:'john@example.com' }, phoneNumber: { type:'string', example:'9876543210' } } } } } } */
  customerController.register);

router.post("/auth/login",
  /*  #swagger.tags = ['BingoPay - Customer Auth']
      #swagger.summary = 'Login with the local password set at registration; refreshes status/uuid from BinGold'
      #swagger.requestBody = { required: true, content: { "application/json": { schema: { type: 'object', required: ['email','password'], properties: { email: { type:'string', example:'john@example.com' }, password: { type:'string', example:'Passw0rd@123' } } } } } } */
  customerController.login);

router.post("/auth/verify-otp",
  /*  #swagger.tags = ['BingoPay - Customer Auth']
      #swagger.summary = 'Verify an OTP (signup/login/2fa) against BinGold'
      #swagger.requestBody = { required: true, content: { "application/json": { schema: { type: 'object', required: ['email','otp'], properties: { email: { type:'string', example:'john@example.com' }, otp: { type:'string', example:'123456' }, type: { type:'string', example:'SIGNUP' }, tOtp: { type:'string' }, newEmail: { type:'string' }, google2faSecret: { type:'string' }, token: { type:'string' } } } } } } */
  customerController.verifyOtp);

router.post("/auth/resend-otp",
  /*  #swagger.tags = ['BingoPay - Customer Auth']
      #swagger.summary = 'Resend an OTP via BinGold'
      #swagger.requestBody = { required: true, content: { "application/json": { schema: { type: 'object', required: ['email'], properties: { email: { type:'string', example:'john@example.com' }, type: { type:'string', example:'SIGNUP' } } } } } } */
  customerController.resendOtp);

// ─── Wallet (proxied to BinGold, requires BinGold token) ─────────
router.post("/wallet/balance", bingoldAuth,
  /*  #swagger.tags = ['BingoPay - Wallet']
      #swagger.summary = 'Get wallet balance from BinGold (requires BinGold token)'
      #swagger.requestBody = { content: { "application/json": { schema: { type: 'object', properties: { portfolioBalance: { type:'integer', example:1 }, email: { type:'string', description:'optional, for audit attribution' } } } } } } */
  walletController.balance);

router.get("/wallet/profile", bingoldAuth,
  /*  #swagger.tags = ['BingoPay - Wallet']
      #swagger.summary = 'Get the BinGold user profile (requires BinGold token)' */
  walletController.profile);

router.post("/wallet/ledger", bingoldAuth,
  /*  #swagger.tags = ['BingoPay - Wallet']
      #swagger.summary = 'Wallet ledger / transaction history (deposits, withdrawals, buys)'
      #swagger.requestBody = { content: { "application/json": { schema: { type: 'object', properties: { type: { type:'string', example:'buy' }, coin: { type:'string', example:'BIGOD' }, coinSymbol: { type:'string' }, page: { type:'integer', example:1 }, size: { type:'integer', example:20 } } } } } } */
  walletController.ledger);

router.post("/wallet/withdraw", bingoldAuth,
  /*  #swagger.tags = ['BingoPay - Wallet']
      #swagger.summary = 'Request a withdrawal (BinGold enforces KYC-approved + 2FA)'
      #swagger.requestBody = { required: true, content: { "application/json": { schema: { type: 'object', required: ['amount','coin','address'], properties: { amount: { type:'number', example:50 }, coin: { type:'string', example:'USDT' }, address: { type:'string', example:'0x1234...' }, note: { type:'string' } } } } } } */
  walletController.withdraw);

module.exports = router;
