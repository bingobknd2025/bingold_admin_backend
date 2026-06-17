// routes/admin/bingopay/vendor.routes.js
const router = require("express").Router();
const vendorController = require("../../../controllers/bingopay/vendor.controller");
const checkPermission = require("../../../middleware/permission.middleware");
const upload = require("../../../middleware/upload.middleware");
const VendorKycService = require("../../../services/bingopay/vendor-kyc.service");

// One optional file field per KYC document type.
const kycUpload = upload.fields(VendorKycService.DOCUMENT_TYPES.map((t) => ({ name: t, maxCount: 1 })));

router.post("/create", checkPermission('vendor.create'), vendorController.create);
router.post("/list", checkPermission('vendor.list'), vendorController.list);
router.post("/view", checkPermission('vendor.view'), vendorController.view);
router.post("/update", checkPermission('vendor.update'), vendorController.update);
router.post("/approve", checkPermission('vendor.approve'), vendorController.approve);
router.post("/reject", checkPermission('vendor.reject'), vendorController.reject);
router.post("/change-status", checkPermission('vendor.change-status'), vendorController.changeStatus);
// ─── KYC ─────────────────────────────────────────────────────
// Online (Sumsub)
router.post("/initiate-kyc", checkPermission('vendor.kyc'), vendorController.initiateKyc);
// Offline (manual documents) — admin submits / reviews on the vendor's behalf
router.post("/kyc/submit", checkPermission('vendor.kyc'), kycUpload, vendorController.submitKycDocuments);
router.post("/kyc/documents", checkPermission('vendor.view'), vendorController.kycDocuments);
router.post("/kyc/review-document", checkPermission('vendor.kyc'), vendorController.reviewKycDocument);

module.exports = router;
