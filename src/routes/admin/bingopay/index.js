// routes/admin/bingopay/index.js
//
// BingoPay admin domain. Mounted at /api/bingold/admin/bingopay behind the
// api-key + JWT middleware (same as the rest of the admin surface).
const router = require("express").Router();

router.use("/users", require("./bingopay_user.routes"));
router.use("/vendors", require("./vendor.routes"));
router.use("/qr", require("./qr.routes"));
router.use("/payments", require("./payment.routes"));
router.use("/settlements", require("./settlement.routes"));

module.exports = router;
