// routes/admin/bingopay/qr.routes.js
const router = require("express").Router();
const qrController = require("../../../controllers/bingopay/qr.controller");
const checkPermission = require("../../../middleware/permission.middleware");

router.post("/create", checkPermission('payment_qr.create'),
  /*  #swagger.tags = ['BingoPay Admin - QR']
      #swagger.summary = 'Create a payment QR for a vendor (admin)'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['vendor_id'], properties: { vendor_id:{type:'integer'}, qr_type:{type:'string', enum:['static','dynamic']}, amount:{type:'number'}, coin:{type:'string', example:'BIGOD'}, label:{type:'string'} } } } } } */
  qrController.create);

router.post("/list", checkPermission('payment_qr.list'),
  /*  #swagger.tags = ['BingoPay Admin - QR']
      #swagger.summary = 'List payment QR codes'
      #swagger.requestBody = { content: { "application/json": { schema: { type:'object', properties: { page:{type:'integer'}, limit:{type:'integer'}, vendor_id:{type:'integer'}, qr_type:{type:'string'}, status:{type:'boolean'} } } } } } */
  qrController.list);

router.post("/view", checkPermission('payment_qr.view'),
  /*  #swagger.tags = ['BingoPay Admin - QR']
      #swagger.summary = 'Get one payment QR'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['id'], properties: { id:{type:'integer'} } } } } } */
  qrController.view);

router.post("/change-status", checkPermission('payment_qr.change-status'),
  /*  #swagger.tags = ['BingoPay Admin - QR']
      #swagger.summary = 'Enable/disable a payment QR'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['id','status'], properties: { id:{type:'integer'}, status:{type:'boolean'} } } } } } */
  qrController.changeStatus);

module.exports = router;
