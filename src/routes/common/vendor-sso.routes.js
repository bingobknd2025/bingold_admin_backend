// routes/common/vendor-sso.routes.js
//
// Partner/SSO-facing vendor endpoints. Mounted at /api/v1/common/vendors behind
// the global x-api-key middleware (no JWT). Vendors are addressed by `uuid`.
const router = require("express").Router();
const ctrl = require("../../controllers/common/vendor-sso.controller");

// ─── Onboarding / auth (static paths first) ──────────────────────────
router.post("/sso/register",
  /*  #swagger.tags = ['Vendor SSO']
      #swagger.summary = 'Register a vendor via BinGold external API (server-to-server, no OTP). Stores the SAME BinGold uuid on both tables and returns a vendor JWT + BinGold token.'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['fullName','shopName','shopSlug','email','phone','password','countryId'], properties: { fullName:{type:'string'}, email:{type:'string'}, phone:{type:'string'}, password:{type:'string', description:'Strong: 8+ chars incl. upper/lower/number/special'}, countryId:{type:'string', description:'Dialing code, e.g. 91'}, shopName:{type:'string'}, shopSlug:{type:'string'}, businessName:{type:'string'}, description:{type:'string'}, gstNumber:{type:'string'}, panNumber:{type:'string'}, supportEmail:{type:'string'}, supportPhone:{type:'string'} } }, example: { fullName:'Acme Owner', email:'owner@acme.com', phone:'9876543210', password:'Secret@123', countryId:'91', shopName:'Acme Store', shopSlug:'acme-store', businessName:'Acme Pvt Ltd', description:'We sell gadgets', gstNumber:'22AAAAA0000A1Z5', panNumber:'AAAAA0000A', supportEmail:'support@acme.com', supportPhone:'9876543211' } } } } */
  ctrl.register);

router.post("/sso/login",
  /*  #swagger.tags = ['Vendor SSO']
      #swagger.summary = 'Vendor login (identifier = email or phone) against the local password; refreshes status from BinGold. Returns a marketplace JWT.'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['identifier','password'], properties: { identifier:{type:'string'}, password:{type:'string'} } }, example: { identifier:'owner@acme.com', password:'Secret@123' } } } } */
  ctrl.login);

router.post("/sso/verify",
  /*  #swagger.tags = ['Vendor SSO']
      #swagger.summary = 'Verify a scanned SSO token (marks it USED).'
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['token'], properties: { token:{type:'string'}, scannedByUserUuid:{type:'string'} } }, example: { token:'<rawToken from the QR response>', scannedByUserUuid:'a1b2c3d4-1111-2222-3333-444455556666' } } } } */
  ctrl.verify);

router.get("/sso/status/:token",
  /*  #swagger.tags = ['Vendor SSO']
      #swagger.summary = 'Poll an SSO token status (PENDING | USED | EXPIRED).'
      #swagger.parameters['token'] = { in:'path', required:true, type:'string' } */
  ctrl.status);

router.get("/sso/vendor-status/:identifier",
  /*  #swagger.tags = ['Vendor SSO']
      #swagger.summary = 'Check a vendor status by vendor uuid or owner email.'
      #swagger.parameters['identifier'] = { in:'path', required:true, type:'string', description:'vendor uuid or owner email' } */
  ctrl.vendorStatus);

// ─── Per-vendor (uuid) operations ────────────────────────────────────
router.post("/:uuid/sso/qr",
  /*  #swagger.tags = ['Vendor SSO']
      #swagger.summary = 'Generate an SSO QR + token for a vendor.'
      #swagger.parameters['uuid'] = { in:'path', required:true, type:'string' }
      #swagger.requestBody = { content: { "application/json": { schema: { type:'object', properties: { ttlSeconds:{type:'integer'}, redirectUrl:{type:'string'} } }, example: { ttlSeconds:300, redirectUrl:'https://partner-app.com/vendor-sso/verify' } } } } */
  ctrl.generateQr);

router.post("/:uuid/sso/kyc",
  /*  #swagger.tags = ['Vendor SSO']
      #swagger.summary = 'Submit KYC/KYB documents (by URL) for a vendor.'
      #swagger.parameters['uuid'] = { in:'path', required:true, type:'string' }
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['documents'], properties: { kybMode:{type:'string', enum:['ONLINE','OFFLINE']}, documents:{ type:'array', items:{ type:'object', required:['documentType','documentUrl'], properties: { documentType:{type:'string'}, documentUrl:{type:'string'}, publicId:{type:'string'} } } } } }, example: { kybMode:'ONLINE', documents:[ { documentType:'GST_CERTIFICATE', documentUrl:'https://res.cloudinary.com/demo/upload/gst.pdf', publicId:'vendor_docs/gst_abc' }, { documentType:'PAN_CARD', documentUrl:'https://res.cloudinary.com/demo/upload/pan.jpg' } ] } } } } */
  ctrl.submitKyc);

router.get("/:uuid/sso/kyc",
  /*  #swagger.tags = ['Vendor SSO']
      #swagger.summary = 'Get KYC status + documents for a vendor.'
      #swagger.parameters['uuid'] = { in:'path', required:true, type:'string' } */
  ctrl.getKyc);

router.patch("/:uuid/sso/kyc/decision",
  /*  #swagger.tags = ['Vendor SSO']
      #swagger.summary = 'Apply a KYC/KYB decision (APPROVED | REJECTED | RECHECK).'
      #swagger.parameters['uuid'] = { in:'path', required:true, type:'string' }
      #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['result'], properties: { result:{type:'string', enum:['APPROVED','REJECTED','RECHECK']}, amlStatus:{type:'string'}, reasons:{type:'array', items:{type:'string'}}, message:{type:'string'}, reviewedBy:{type:'string'} } }, examples: { Approve: { summary:'Approve', value: { result:'APPROVED', amlStatus:'CLEAR', reviewedBy:'provider-x' } }, Reject: { summary:'Reject', value: { result:'REJECTED', reasons:['GST certificate unreadable'], reviewedBy:'provider-x' } }, Recheck: { summary:'Recheck', value: { result:'RECHECK', message:'Please re-upload a clearer PAN card', reasons:['PAN blurry'] } } } } } } */
  ctrl.kycDecision);

module.exports = router;
