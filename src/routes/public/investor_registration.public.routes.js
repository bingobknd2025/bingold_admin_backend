// routes/public/investor_registration.public.routes.js
//
// Mounted under /api/bingold/investor-registration, i.e. above the JWT
// middleware — authenticated by x-api-key only, exactly like the other
// investor/BingoPay-facing public surfaces.
const router = require('express').Router();
const upload = require('../../middleware/upload.middleware');
const controller = require('../../controllers/public/investor_registration.public.controller');
const InvestorRegistrationService = require('../../services/investor-registration.service');

// One multipart field per document type; the user attaches whichever apply.
const documentFields = InvestorRegistrationService.DOCUMENT_TYPES.map((doc) => ({
    name: doc.doc_type,
    maxCount: 1
}));

router.post('/capture',
    /*  #swagger.tags = ['Investor Registration']
        #swagger.summary = 'Capture an investor-ui signup (account type + profile). No credentials.'
        #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['email'], properties: { email:{type:'string'}, account_type:{type:'string', enum:['individual','company']}, first_name:{type:'string'}, last_name:{type:'string'}, phone:{type:'string'}, country:{type:'string'}, ref_code:{type:'string'}, meta:{type:'object'} } } } } } */
    controller.capture);

router.post('/verified',
    /*  #swagger.tags = ['Investor Registration']
        #swagger.summary = 'Mark a captured signup as OTP-verified'
        #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['email'], properties: { email:{type:'string'} } } } } } */
    controller.verified);

router.post('/status',
    /*  #swagger.tags = ['Investor Registration']
        #swagger.summary = 'Account type + document status for an email (drives the investor-ui login redirect)'
        #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['email'], properties: { email:{type:'string'} } } } } } */
    controller.status);

router.post('/requirements',
    /*  #swagger.tags = ['Investor Registration']
        #swagger.summary = 'List the company documents that must be collected' */
    controller.requirements);

router.post('/documents',
    upload.fields(documentFields),
    /*  #swagger.tags = ['Investor Registration']
        #swagger.summary = 'Upload company registration documents (multipart, one file per doc_type)'
        #swagger.consumes = ['multipart/form-data'] */
    controller.uploadDocuments);

module.exports = router;
