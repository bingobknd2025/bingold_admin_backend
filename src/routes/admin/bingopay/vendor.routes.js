// routes/admin/bingopay/vendor.routes.js
const router = require("express").Router();
const vendorController = require("../../../controllers/bingopay/vendor.controller");
const checkPermission = require("../../../middleware/permission.middleware");
const upload = require("../../../middleware/upload.middleware");
const VendorKycService = require("../../../services/bingopay/vendor-kyc.service");

// One optional file field per KYC document type.
const kycUpload = upload.fields(VendorKycService.DOCUMENT_TYPES.map((t) => ({ name: t, maxCount: 1 })));

router.post("/create", checkPermission('vendor.create'),
  /*  #swagger.tags = ['BingoPay Admin - Vendors']
      #swagger.summary = 'Onboard a vendor (admin). Provide user_id OR email/phone + business details.'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['business_name'], properties: { user_id:{type:'integer'}, email:{type:'string'}, phone:{type:'string'}, business_name:{type:'string', example:'ABC Store'}, business_type:{type:'string'}, gst_number:{type:'string'}, pan_number:{type:'string'}, address:{type:'string'}, website:{type:'string'}, annual_turnover:{type:'number'} } } } } } */
  vendorController.create);

router.post("/list", checkPermission('vendor.list'),
  /*  #swagger.tags = ['BingoPay Admin - Vendors']
      #swagger.summary = 'List vendors (paginated, filterable)'
      #swagger.requestBody = { content: { "application/json": { schema: { type:'object', properties: { page:{type:'integer'}, limit:{type:'integer'}, search:{type:'string'}, status:{type:'string'}, kyc_status:{type:'string'} } } } } } */
  vendorController.list);

router.post("/view", checkPermission('vendor.view'),
  /*  #swagger.tags = ['BingoPay Admin - Vendors']
      #swagger.summary = 'Get one vendor'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['id'], properties: { id:{type:'integer'} } } } } } */
  vendorController.view);

router.post("/update", checkPermission('vendor.update'),
  /*  #swagger.tags = ['BingoPay Admin - Vendors']
      #swagger.summary = 'Update vendor business fields'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['id'], properties: { id:{type:'integer'}, business_name:{type:'string'}, business_type:{type:'string'}, gst_number:{type:'string'}, pan_number:{type:'string'}, address:{type:'string'}, website:{type:'string'} } } } } } */
  vendorController.update);

router.post("/approve", checkPermission('vendor.approve'),
  /*  #swagger.tags = ['BingoPay Admin - Vendors']
      #swagger.summary = 'Approve vendor (kyc_status=approved, status=active)'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['id'], properties: { id:{type:'integer'} } } } } } */
  vendorController.approve);

router.post("/reject", checkPermission('vendor.reject'),
  /*  #swagger.tags = ['BingoPay Admin - Vendors']
      #swagger.summary = 'Reject vendor'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['id'], properties: { id:{type:'integer'}, reason:{type:'string'} } } } } } */
  vendorController.reject);

router.post("/change-status", checkPermission('vendor.change-status'),
  /*  #swagger.tags = ['BingoPay Admin - Vendors']
      #swagger.summary = 'Set vendor status (pending|active|suspended|rejected)'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['id','status'], properties: { id:{type:'integer'}, status:{type:'string'} } } } } } */
  vendorController.changeStatus);

// ─── KYC ─────────────────────────────────────────────────────
// Online (Sumsub)
router.post("/initiate-kyc", checkPermission('vendor.kyc'),
  /*  #swagger.tags = ['BingoPay Admin - Vendors']
      #swagger.summary = 'Start Sumsub (online) KYC; returns applicant_id + WebSDK access_token'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['id'], properties: { id:{type:'integer'} } } } } } */
  vendorController.initiateKyc);

// Offline (manual documents) — admin submits / reviews on the vendor's behalf
router.post("/kyc/submit", checkPermission('vendor.kyc'), kycUpload,
  /*  #swagger.tags = ['BingoPay Admin - Vendors']
      #swagger.summary = 'Submit offline KYC documents for a vendor (multipart). vendor_id as form field.'
      #swagger.requestBody = { content: { "multipart/form-data": { schema: { type:'object', required:['vendor_id'], properties: { vendor_id:{type:'integer'}, certificate_of_incorporation:{type:'string', format:'binary'}, gst_certificate:{type:'string', format:'binary'}, pan_card:{type:'string', format:'binary'}, director_id:{type:'string', format:'binary'}, address_proof:{type:'string', format:'binary'}, bank_statement:{type:'string', format:'binary'}, selfie:{type:'string', format:'binary'}, other:{type:'string', format:'binary'} } } } } } */
  vendorController.submitKycDocuments);

router.post("/kyc/documents", checkPermission('vendor.view'),
  /*  #swagger.tags = ['BingoPay Admin - Vendors']
      #swagger.summary = 'List offline KYC documents for a vendor'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['vendor_id'], properties: { vendor_id:{type:'integer'} } } } } } */
  vendorController.kycDocuments);

router.post("/kyc/review-document", checkPermission('vendor.kyc'),
  /*  #swagger.tags = ['BingoPay Admin - Vendors']
      #swagger.summary = 'Approve/reject a single KYC document'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['document_id','status'], properties: { document_id:{type:'integer'}, status:{type:'string', enum:['approved','rejected','pending']}, note:{type:'string'} } } } } } */
  vendorController.reviewKycDocument);

module.exports = router;
