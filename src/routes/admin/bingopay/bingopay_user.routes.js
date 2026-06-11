// routes/admin/bingopay/bingopay_user.routes.js
const router = require("express").Router();
const userController = require("../../../controllers/bingopay/bingopay_user.controller");
const checkPermission = require("../../../middleware/permission.middleware");

router.post("/list", checkPermission('bingopay_user.list'),
  /*  #swagger.tags = ['BingoPay Admin - Users']
      #swagger.summary = 'List BingoPay users (mappings to BinGold)'
      #swagger.requestBody = { content: { "application/json": { schema: { type:'object', properties: { page:{type:'integer'}, limit:{type:'integer'}, search:{type:'string'}, account_type:{type:'string', enum:['customer','vendor','merchant_staff']}, status:{type:'string'}, kyc_status:{type:'string'} } } } } } */
  userController.list);

router.post("/view", checkPermission('bingopay_user.view'),
  /*  #swagger.tags = ['BingoPay Admin - Users']
      #swagger.summary = 'Get one BingoPay user'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['id'], properties: { id:{type:'integer'} } } } } } */
  userController.view);

router.post("/change-status", checkPermission('bingopay_user.change-status'),
  /*  #swagger.tags = ['BingoPay Admin - Users']
      #swagger.summary = 'Change a BingoPay user status (pending|active|blocked|suspended)'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['id','status'], properties: { id:{type:'integer'}, status:{type:'string'} } } } } } */
  userController.changeStatus);

// Check an email against BinGold (user_exists) and persist the DB entry.
router.post("/check-bingold", checkPermission('bingopay_user.view'),
  /*  #swagger.tags = ['BingoPay Admin - Users']
      #swagger.summary = 'Check an email against BinGold (user_exists) and persist the mapping if it exists'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['email'], properties: { email:{type:'string'} } } } } } */
  userController.checkAndSync);

module.exports = router;
