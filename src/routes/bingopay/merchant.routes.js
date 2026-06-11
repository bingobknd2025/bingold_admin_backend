// routes/bingopay/merchant.routes.js
//
// Vendor (merchant) self-service surface. Mounted at /api/bingold/bingopay/merchant.
// Every route requires the merchant's BinGold session token (bingoldAuth).
const router = require("express").Router();
const merchant = require("../../controllers/bingopay/merchant.controller");
const bingoldAuth = require("../../middleware/bingoldAuth.middleware");
const upload = require("../../middleware/upload.middleware");
const VendorKycService = require("../../services/bingopay/vendor-kyc.service");

// One optional file field per KYC document type.
const kycUpload = upload.fields(VendorKycService.DOCUMENT_TYPES.map((t) => ({ name: t, maxCount: 1 })));

// All merchant routes carry the merchant's BinGold token.
router.use(bingoldAuth);

router.post("/apply",
  /*  #swagger.tags = ['BingoPay - Merchant']
      #swagger.summary = 'Apply to become a merchant (idempotent). Creates the vendor profile.'
      #swagger.requestBody = { required: true, content: { "application/json": { schema: { type:'object', required:['business_name'], properties: { business_name:{type:'string', example:'ABC Store'}, business_type:{type:'string'}, registration_number:{type:'string'}, gst_number:{type:'string'}, pan_number:{type:'string'}, address:{type:'string'}, website:{type:'string'}, annual_turnover:{type:'number'}, settle_coin:{type:'string', example:'BIGOD'}, accepted_coins:{type:'array', items:{type:'string'}, example:['BIGOD','USDT']} } } } } } */
  merchant.apply);

router.post("/me",
  /*  #swagger.tags = ['BingoPay - Merchant']
      #swagger.summary = 'Get my merchant profile + status' */
  merchant.me);

router.post("/settings",
  /*  #swagger.tags = ['BingoPay - Merchant']
      #swagger.summary = 'Update settle_coin / accepted_coins and safe business fields'
      #swagger.requestBody = { content: { "application/json": { schema: { type:'object', properties: { settle_coin:{type:'string', example:'BIGOD'}, accepted_coins:{type:'array', items:{type:'string'}, example:['BIGOD','USDT','BNB']}, business_name:{type:'string'}, business_type:{type:'string'}, website:{type:'string'}, address:{type:'string'} } } } } } */
  merchant.updateSettings);

router.post("/qr/create",
  /*  #swagger.tags = ['BingoPay - Merchant']
      #swagger.summary = 'Create a payment QR (static = open/fixed, dynamic = per-charge)'
      #swagger.requestBody = { content: { "application/json": { schema: { type:'object', properties: { qr_type:{type:'string', enum:['static','dynamic'], example:'static'}, amount:{type:'number', description:'omit for open amount'}, coin:{type:'string', example:'BIGOD'}, label:{type:'string'} } } } } } */
  merchant.createQr);

router.post("/qr/list",
  /*  #swagger.tags = ['BingoPay - Merchant']
      #swagger.summary = 'List my QR codes'
      #swagger.requestBody = { content: { "application/json": { schema: { type:'object', properties: { page:{type:'integer'}, limit:{type:'integer'}, qr_type:{type:'string'}, status:{type:'boolean'} } } } } } */
  merchant.listQr);

router.post("/qr/toggle",
  /*  #swagger.tags = ['BingoPay - Merchant']
      #swagger.summary = 'Enable/disable one of my QR codes'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['id','status'], properties: { id:{type:'integer'}, status:{type:'boolean'} } } } } } */
  merchant.toggleQr);

// Offline KYC — vendor uploads their own documents (multipart/form-data)
router.post("/kyc/submit", kycUpload,
  /*  #swagger.tags = ['BingoPay - Merchant']
      #swagger.summary = 'Submit offline KYC documents (multipart; one file per type)'
      #swagger.requestBody = { content: { "multipart/form-data": { schema: { type:'object', properties: { certificate_of_incorporation:{type:'string', format:'binary'}, gst_certificate:{type:'string', format:'binary'}, pan_card:{type:'string', format:'binary'}, director_id:{type:'string', format:'binary'}, address_proof:{type:'string', format:'binary'}, bank_statement:{type:'string', format:'binary'}, selfie:{type:'string', format:'binary'}, other:{type:'string', format:'binary'} } } } } } */
  merchant.submitKyc);

router.post("/kyc/documents",
  /*  #swagger.tags = ['BingoPay - Merchant']
      #swagger.summary = 'List my submitted KYC documents + statuses' */
  merchant.kycDocuments);

router.post("/dashboard",
  /*  #swagger.tags = ['BingoPay - Merchant']
      #swagger.summary = 'Sales dashboard: totals + earnings by coin (today and overall)' */
  merchant.dashboard);

router.post("/payments",
  /*  #swagger.tags = ['BingoPay - Merchant']
      #swagger.summary = 'My received payments (merchant payment log)'
      #swagger.requestBody = { content: { "application/json": { schema: { type:'object', properties: { page:{type:'integer'}, limit:{type:'integer'}, status:{type:'string'}, coin:{type:'string'} } } } } } */
  merchant.payments);

router.post("/withdraw",
  /*  #swagger.tags = ['BingoPay - Merchant']
      #swagger.summary = 'Withdraw earnings (proxies BinGold withdraw_request)'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['amount','coin','address'], properties: { amount:{type:'number'}, coin:{type:'string', example:'USDT'}, address:{type:'string'}, note:{type:'string'} } } } } } */
  merchant.withdraw);

module.exports = router;
