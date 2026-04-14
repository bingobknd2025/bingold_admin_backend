// routes/user.routes.js
const router = require("express").Router();
const userController = require("../../controllers/user.controller");
const checkPermission = require("../../middleware/permission.middleware");

// Self profile FIRST
router.post("/me/profile", userController.getMyProfile);
router.post("/me/profile/update", userController.updateMyProfile);


// Admin routes AFTER
router.post("/create", checkPermission('user.create'), userController.createUser);
router.post("/list", checkPermission('user.list'), userController.getUsers);
router.post("/view", checkPermission('user.view'), userController.getUser);
router.post("/update", checkPermission('user.update'), userController.updateUser);
router.post("/delete", checkPermission('user.delete'), userController.deleteUser);
router.post("/update/status", checkPermission('user.update'), userController.updateUserStatus);
router.post("/permissions", checkPermission('user.view'), userController.getUserPermissions);
module.exports = router;