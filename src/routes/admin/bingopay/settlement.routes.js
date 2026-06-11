// routes/admin/bingopay/settlement.routes.js
const router = require("express").Router();
const settlementController = require("../../../controllers/bingopay/settlement.controller");
const checkPermission = require("../../../middleware/permission.middleware");

router.post("/create", checkPermission('settlement.create'),
  /*  #swagger.tags = ['BingoPay Admin - Settlements']
      #swagger.summary = 'Create a settlement batch for a vendor'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['vendor_id','total_amount'], properties: { vendor_id:{type:'integer'}, total_amount:{type:'number'}, coin:{type:'string', example:'BIGOD'}, note:{type:'string'} } } } } } */
  settlementController.create);

router.post("/list", checkPermission('settlement.list'),
  /*  #swagger.tags = ['BingoPay Admin - Settlements']
      #swagger.summary = 'List settlement batches'
      #swagger.requestBody = { content: { "application/json": { schema: { type:'object', properties: { page:{type:'integer'}, limit:{type:'integer'}, vendor_id:{type:'integer'}, settlement_status:{type:'string'} } } } } } */
  settlementController.list);

router.post("/view", checkPermission('settlement.view'),
  /*  #swagger.tags = ['BingoPay Admin - Settlements']
      #swagger.summary = 'Get one settlement'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['id'], properties: { id:{type:'integer'} } } } } } */
  settlementController.view);

router.post("/update-status", checkPermission('settlement.manage'),
  /*  #swagger.tags = ['BingoPay Admin - Settlements']
      #swagger.summary = 'Advance settlement status (pending->processing->completed / failed)'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['id','status'], properties: { id:{type:'integer'}, status:{type:'string', enum:['processing','completed','failed','pending']}, bingold_withdraw_reference:{type:'string'}, note:{type:'string'} } } } } } */
  settlementController.updateStatus);

module.exports = router;
