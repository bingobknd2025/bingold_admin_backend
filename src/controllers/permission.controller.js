// controllers/permission.controller.js
const PermissionService = require('../services/permission.service');
class PermissionController {
    async createPermission(req, res, next) {
        try {
            const permission = await PermissionService.createPermission(req.body);
            res.status(201).json({
                success: true,
                message: 'Permission created successfully',
                data: permission
            });
        } catch (error) {
            next(error);
        }
    }

    async getPermissions(req, res, next) {
        try {
            const { page, limit, search, module } = req.body;
            const result = await PermissionService.getPermissions(
                parseInt(page, 10),
                parseInt(limit, 10),
                { search, module }
            );
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getPermissionsbyGroup(req, res, next) {
        try {
            const { search, module } = req.query;
            const result = await PermissionService.getPermissionbygroup(
                // parseInt(page),
                // parseInt(limit),
                { search, module }
            );
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getPermission(req, res, next) {
        try {
            const { id } = req.body;

            if (!id) {
                throw new ApiError(400, 'Permission id is required');
            }

            const permission = await PermissionService.getPermissionById(id);

            res.json({
                success: true,
                message: 'Permission retrieved successfully',
                data: permission
            });
        } catch (error) {
            next(error);
        }
    }

    async updatePermission(req, res, next) {
        try {
            const { id, ...data } = req.body;

            if (!id) {
                throw new ApiError(400, 'Permission id is required');
            }

            const permission = await PermissionService.updatePermission(id, data);

            res.json({
                success: true,
                message: 'Permission updated successfully',
                data: permission
            });
        } catch (error) {
            next(error);
        }
    }

    async deletePermission(req, res, next) {
        try {
            const { id } = req.body;

            if (!id) {
                throw new ApiError(400, 'Permission id is required');
            }

            const result = await PermissionService.deletePermission(id);

            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async getPermissionModules(req, res, next) {
        try {
            const modules = await PermissionService.getPermissionModules();
            res.json({
                success: true,
                message: 'Permission modules retrieved successfully',
                data: modules
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PermissionController();