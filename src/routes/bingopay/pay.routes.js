// routes/bingopay/pay.routes.js
//
// Customer payment surface. Mounted at /api/bingold/bingopay/pay.
// resolve + quote are open (api-key only); confirm needs the payer's BinGold token.
const router = require("express").Router();
const pay = require("../../controllers/bingopay/pay.controller");
const bingoldAuth = require("../../middleware/bingoldAuth.middleware");

// Scan -> who am I paying + accepted coins
router.get("/resolve/:qrUuid",
  /*  #swagger.tags = ['BingoPay - Pay']
      #swagger.summary = 'Resolve a scanned QR to merchant info + accepted coins'
      #swagger.parameters['qrUuid'] = { in: 'path', required: true, type: 'string' } */
  pay.resolve);

router.post("/resolve",
  /*  #swagger.tags = ['BingoPay - Pay']
      #swagger.summary = 'Resolve a QR (uuid in body) to merchant info + accepted coins'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['qrUuid'], properties: { qrUuid:{type:'string'} } } } } } */
  pay.resolve);

// How much of <payCoin> is needed (with conversion)
router.post("/quote",
  /*  #swagger.tags = ['BingoPay - Pay']
      #swagger.summary = 'Quote: how much payCoin is needed (USD-based conversion to merchant settle coin)'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['qrUuid','payCoin'], properties: { qrUuid:{type:'string'}, payCoin:{type:'string', example:'USDT'}, amount:{type:'number', description:'required for open-amount QR'} } } } } } */
  pay.quote);

// Execute the payment (requires payer BinGold token)
router.post("/confirm", bingoldAuth,
  /*  #swagger.tags = ['BingoPay - Pay']
      #swagger.summary = 'Confirm + execute payment. Records the txn and calls the BinGold transfer adapter (transferPending=true until BINGOLD_TRANSFER_PATH is set).'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['qrUuid'], properties: { qrUuid:{type:'string'}, payCoin:{type:'string', example:'USDT'}, amount:{type:'number'}, pin:{type:'string'}, otp:{type:'string'}, note:{type:'string'} } } } } } */
  pay.confirm);

module.exports = router;
