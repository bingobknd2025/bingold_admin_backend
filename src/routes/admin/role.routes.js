// routes/role.routes.js
const router = require("express").Router();
const roleController = require("../../controllers/role.controller");
const checkPermission = require("../../middleware/permission.middleware");

// Role routes
router.post("/create", checkPermission('role.create'), roleController.createRole);
router.post("/list", checkPermission('role.list'), roleController.getRoles);
router.post("/view", checkPermission('role.view'), roleController.getRole);
router.post("/update", checkPermission('role.update'), roleController.updateRole);
router.post("/delete", checkPermission('role.delete'), roleController.deleteRole);

// Role permission management
router.post("/permissions", checkPermission('assigned.permissions'), roleController.getRolePermissions);
router.post("/assign-permissions", checkPermission('role.assign-permissions'), roleController.assignPermissions);
router.post("/remove-permission", checkPermission('role.assign-permissions'), roleController.removePermission);


module.exports = router;