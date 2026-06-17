const router = require("express").Router();
const ctrl = require("../../controllers/common/vendor-sso.controller");

// ─── Onboarding / auth (static paths first) ──────────────────────────
router.post("/sso/register", ctrl.register);

router.post("/sso/login", ctrl.login);

router.post("/sso/verify", ctrl.verify);

router.get("/sso/status/:token", ctrl.status);

router.get("/sso/vendor-status/:identifier", ctrl.vendorStatus);

router.post("/:uuid/sso/qr", ctrl.generateQr);

router.post("/:uuid/sso/kyc", ctrl.submitKyc);

router.get("/:uuid/sso/kyc", ctrl.getKyc);

router.patch("/:uuid/sso/kyc/decision", ctrl.kycDecision);

module.exports = router;
