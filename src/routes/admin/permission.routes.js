// routes/permission.routes.js
const router = require("express").Router();
const permissionController = require("../../controllers/permission.controller");
const checkPermission = require("../../middleware/permission.middleware");

// Permission routes
router.post("/create", checkPermission('permission.create'), permissionController.createPermission);
router.post("/list", checkPermission('permission.list'), permissionController.getPermissions);
router.post("/group-list", checkPermission('permission.view'), permissionController.getPermissionsbyGroup);
router.post("/modules", checkPermission('permission.view'), permissionController.getPermissionModules);
router.post("/view", checkPermission('permission.view'), permissionController.getPermission);
router.post("/update", checkPermission('permission.update'), permissionController.updatePermission);
router.post("/delete", checkPermission('permission.delete'), permissionController.deletePermission);

module.exports = router;