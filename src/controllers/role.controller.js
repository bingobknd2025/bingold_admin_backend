// controllers/role.controller.js
const RoleService = require('../services/role.service');

class RoleController {
    async createRole(req, res, next) {
        try {
            const role = await RoleService.createRole(req.body);
            res.status(201).json({
                success: true,
                message: 'Role created successfully',
                data: role
            });
        } catch (error) {
            next(error);
        }
    }

    async getRoles(req, res, next) {
        try {
            const { page, limit, search } = req.body;
            const result = await RoleService.getRoles(
                parseInt(page, 10),
                parseInt(limit, 10),
                { search }
            );
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getRole(req, res, next) {
        try {
            const { roleId } = req.body;
            const role = await RoleService.getRoleById(roleId);
            res.json({
                success: true,
                message: 'Role retrieved successfully',
                data: role
            });
        } catch (error) {
            next(error);
        }
    }

    async updateRole(req, res, next) {
        try {
            const { roleId, ...data } = req.body;

            if (!roleId) {
                throw new ApiError(400, 'roleId is required');
            }

            const role = await RoleService.updateRole(roleId, data);

            res.json({
                success: true,
                message: 'Role updated successfully',
                data: role
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteRole(req, res, next) {
        try {
            const result = await RoleService.deleteRole(req.body.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async assignPermissions(req, res, next) {
        try {
            const { roleId, permission_ids, assignAll } = req.body;

            if (!roleId) {
                throw new ApiError(400, 'roleId is required');
            }

            if (!assignAll && (!Array.isArray(permission_ids) || permission_ids.length === 0)) {
                throw new ApiError(
                    400,
                    'Either permission_ids array or assignAll=true is required'
                );
            }

            const role = await RoleService.assignPermissionsToRole(
                roleId,
                permission_ids,
                assignAll
            );

            res.json({
                success: true,
                message: 'Permissions assigned successfully',
                data: role
            });
        } catch (error) {
            next(error);
        }
    }

    async removePermission(req, res, next) {
        try {
            const { roleId, permission_ids, removeAll } = req.body;

            if (!roleId) {
                throw new ApiError(400, 'roleId is required');
            }

            if (!removeAll && (!Array.isArray(permission_ids) || permission_ids.length === 0)) {
                throw new ApiError(
                    400,
                    'Either permission_ids array or removeAll=true is required'
                );
            }

            const result = await RoleService.removePermissionsFromRole(
                roleId,
                permission_ids,
                removeAll
            );

            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async getRolePermissions(req, res, next) {
        try {
            const { roleId } = req.body;
            const permissions = await RoleService.getRolePermissions(roleId);
            res.json({
                success: true,
                message: 'Permissions retrieved successfully',
                data: permissions,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new RoleController();