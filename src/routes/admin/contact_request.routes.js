// routes/admin/contact_request.routes.js
//
// Mounted at /api/bingold/admin/contact-requests — api-key + JWT + permission.
const router = require("express").Router();
const controller = require("../../controllers/contact_request.controller");
const checkPermission = require("../../middleware/permission.middleware");

router.post("/list", checkPermission('contact_request.list'),
  /*  #swagger.tags = ['Admin - Contact Requests']
      #swagger.summary = 'List contact-us requests'
      #swagger.requestBody = { content: { "application/json": { schema: { type:'object', properties: { page:{type:'integer'}, limit:{type:'integer'}, search:{type:'string'}, status:{type:'string', enum:['NEW','IN_PROGRESS','RESOLVED','CLOSED']}, source:{type:'string'} } } } } } */
  controller.list);

router.post("/counts", checkPermission('contact_request.list'),
  /*  #swagger.tags = ['Admin - Contact Requests']
      #swagger.summary = 'Ticket counts per status (list header badges)' */
  controller.counts);

router.post("/view", checkPermission('contact_request.view'),
  /*  #swagger.tags = ['Admin - Contact Requests']
      #swagger.summary = 'Get one contact request with its full message'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['id'], properties: { id:{type:'integer'} } } } } } */
  controller.view);

router.post("/update-status", checkPermission('contact_request.update-status'),
  /*  #swagger.tags = ['Admin - Contact Requests']
      #swagger.summary = 'Mark a request as in-progress / resolved / closed'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['id','status'], properties: { id:{type:'integer'}, status:{type:'string', enum:['NEW','IN_PROGRESS','RESOLVED','CLOSED']}, admin_note:{type:'string'} } } } } } */
  controller.updateStatus);

router.post("/delete", checkPermission('contact_request.delete'),
  /*  #swagger.tags = ['Admin - Contact Requests']
      #swagger.summary = 'Delete a contact request (spam cleanup)'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['id'], properties: { id:{type:'integer'} } } } } } */
  controller.remove);

module.exports = router;
