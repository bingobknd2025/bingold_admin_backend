// routes/admin/agent.routes.js
// Photo upload flow: client uploads via POST /api/bingold/admin/common/upload-file,
// then passes the returned `url` as `photo` in the create/update body.
const router = require("express").Router();
const agentController = require("../../controllers/agent.controller");
const checkPermission = require("../../middleware/permission.middleware");

router.post("/create", checkPermission('agent.create'), agentController.createAgent);
router.post("/list", checkPermission('agent.list'), agentController.getAgentList);
router.post("/view", checkPermission('agent.view'), agentController.getAgent);
router.post("/update", checkPermission('agent.update'), agentController.updateAgent);
router.post("/regenerate-qr", checkPermission('agent.update'), agentController.regenerateQr);
router.post("/delete", checkPermission('agent.delete'), agentController.deleteAgent);

module.exports = router;
