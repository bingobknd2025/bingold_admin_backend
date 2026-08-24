// routes/admin/investor_registration.routes.js
const router = require("express").Router();
const controller = require("../../controllers/investor_registration.controller");
const checkPermission = require("../../middleware/permission.middleware");

router.post("/list", checkPermission('investor_registration.list'),
  /*  #swagger.tags = ['Admin - Investor Registrations']
      #swagger.summary = 'List captured investor-ui registrations'
      #swagger.requestBody = { content: { "application/json": { schema: { type:'object', properties: { page:{type:'integer'}, limit:{type:'integer'}, search:{type:'string'}, account_type:{type:'string', enum:['individual','company']}, status:{type:'string', enum:['PENDING_OTP','PENDING_DOCUMENTS','DOCS_SUBMITTED','COMPLETED']}, marketing_opt_in:{type:'string', enum:['true','false'], description:'Filter by marketing email opt-in. Omit for all.'} } } } } } */
  controller.list);

router.post("/view", checkPermission('investor_registration.view'),
  /*  #swagger.tags = ['Admin - Investor Registrations']
      #swagger.summary = 'Get one investor registration with its uploaded documents'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['id'], properties: { id:{type:'integer'} } } } } } */
  controller.view);

module.exports = router;
