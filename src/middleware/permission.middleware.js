// middleware/permission.middleware.js
const PermissionService = require('../services/permission.service');

const checkPermission = (permissionSlug) => {
    return async (req, res, next) => {
        try {
            const hasPermission = await PermissionService.checkUserPermission(
                req.user.pda_user_id,
                permissionSlug
            );

            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to perform this action'
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = checkPermission;