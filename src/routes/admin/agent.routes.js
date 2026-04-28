// routes/admin/agent.routes.js
const router = require("express").Router();
const agentController = require("../../controllers/agent.controller");
const checkPermission = require("../../middleware/permission.middleware");
const upload = require("../../middleware/upload.middleware");

const uploadFields = upload.fields([
    { name: 'photo', maxCount: 1 }
]);

router.post("/create", checkPermission('agent.create'), uploadFields, agentController.createAgent);
router.post("/list", checkPermission('agent.list'), agentController.getAgentList);
router.post("/view", checkPermission('agent.view'), agentController.getAgent);
router.post("/update", checkPermission('agent.update'), uploadFields, agentController.updateAgent);
router.post("/regenerate-qr", checkPermission('agent.update'), agentController.regenerateQr);
router.post("/delete", checkPermission('agent.delete'), agentController.deleteAgent);

module.exports = router;
