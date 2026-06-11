// routes/admin/bingopay/payment.routes.js
const router = require("express").Router();
const paymentController = require("../../../controllers/bingopay/payment.controller");
const checkPermission = require("../../../middleware/permission.middleware");

router.post("/list", checkPermission('payment.list'),
  /*  #swagger.tags = ['BingoPay Admin - Payments']
      #swagger.summary = 'List payment transactions (paginated, filterable)'
      #swagger.requestBody = { content: { "application/json": { schema: { type:'object', properties: { page:{type:'integer'}, limit:{type:'integer'}, status:{type:'string'}, coin:{type:'string'}, receiver_vendor_id:{type:'integer'}, from:{type:'string', format:'date-time'}, to:{type:'string', format:'date-time'} } } } } } */
  paymentController.list);

router.post("/view", checkPermission('payment.view'),
  /*  #swagger.tags = ['BingoPay Admin - Payments']
      #swagger.summary = 'Get one payment transaction'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['id'], properties: { id:{type:'integer'} } } } } } */
  paymentController.view);

router.post("/stats", checkPermission('payment.view'),
  /*  #swagger.tags = ['BingoPay Admin - Payments']
      #swagger.summary = 'Payment stats (counts + total success amount)'
      #swagger.requestBody = { content: { "application/json": { schema: { type:'object', properties: { receiver_vendor_id:{type:'integer'} } } } } } */
  paymentController.stats);

module.exports = router;
