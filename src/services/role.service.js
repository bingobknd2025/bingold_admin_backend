// services/role.service.js

const db = require('../models');
const { Op } = db.Sequelize;
const { Role, Permission, RolePermission, PdaUser } = db;
const ApiError = require('../utils/apiError.util');

class RoleService {
    async createRole(data) {
        const existing = await Role.findOne({
            where: {
                [Op.or]: [
                    { slug: data.slug },
                    { name: data.name }
                ]
            }
        });

        if (existing) {
            if (existing.slug === data.slug) {
                throw new ApiError(409, 'Role slug already exists');
            }
            if (existing.name === data.name) {
                throw new ApiError(409, 'Role name already exists');
            }
        }

        return Role.create(data);
    }

    async getRoles(page = 1, limit = 10, filters = {}) {
        const offset = (page - 1) * limit;
        const where = {};

        if (filters.search) {
            where[db.Sequelize.Op.or] = [
                { name: { [db.Sequelize.Op.like]: `%${filters.search}%` } },
                { slug: { [db.Sequelize.Op.like]: `%${filters.search}%` } },
                { description: { [db.Sequelize.Op.like]: `%${filters.search}%` } }
            ];
        }

        const { count, rows } = await db.Role.findAndCountAll({
            where,
            attributes: ['id', 'name', 'slug', 'description'],
            limit,
            offset,
            order: [['name', 'ASC']]
        });

        return {
            total: count,
            page,
            totalPages: Math.ceil(count / limit),
            roles: rows
        };
    }

    async getRoleById(id,) {
        const role = await db.Role.findByPk(id, {
            include: [
                {
                    model: db.Permission,
                    as: 'permissions',
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'slug', 'module']
                }
            ]
        });

        if (!role) {
            throw new ApiError(404, 'Role not found');
        }

        return role;
    }

    async updateRole(id, data) {
        const role = await this.getRoleById(id);

        if (data.slug && data.slug !== role.slug) {
            const existing = await db.Role.findOne({
                where: { slug: data.slug }
            });

            if (existing) {
                throw new ApiError(409, 'Role slug already exists');
            }
        }

        return role.update(data);
    }

    async deleteRole(id) {
        const role = await this.getRoleById(id);

        const userCount = await PdaUser.count({
            where: { role_id: id }
        });

        if (userCount > 0) {
            throw new ApiError(400, 'Cannot delete role assigned to users');
        }

        await RolePermission.destroy({ where: { role_id: id } });

        await role.destroy();
        return { success: true, message: 'Role deleted successfully' };
    }

    async assignPermissionsToRole(roleId, permissionIds = [], assignAll = false) {
        const role = await this.getRoleById(roleId);

        let permissions;

        if (assignAll) {
            permissions = await db.Permission.findAll({ attributes: ['id'] });
        } else {
            permissions = await db.Permission.findAll({
                where: { id: permissionIds },
                attributes: ['id']
            });

            if (permissions.length !== permissionIds.length) {
                throw new ApiError(404, 'Some permissions not found');
            }
        }

        const finalPermissionIds = permissions.map(p => p.id);

        // Replace strategy (clean RBAC)
        await db.RolePermission.destroy({ where: { role_id: roleId } });

        const rolePermissions = finalPermissionIds.map(permissionId => ({
            role_id: roleId,
            permission_id: permissionId
        }));

        if (rolePermissions.length) {
            await db.RolePermission.bulkCreate(rolePermissions);
        }

        return this.getRoleById(roleId);
    }

    async removePermissionsFromRole(roleId, permissionIds = [], removeAll = false) {
        const role = await this.getRoleById(roleId);

        if (removeAll) {
            await db.RolePermission.destroy({
                where: { role_id: roleId }
            });

            return {
                success: true,
                message: 'All permissions removed from role successfully'
            };
        }

        await db.RolePermission.destroy({
            where: {
                role_id: roleId,
                permission_id: permissionIds
            }
        });

        return {
            success: true,
            message: 'Permission(s) removed from role successfully'
        };
    }

    async getRolePermissions(roleId) {
        const role = await db.Role.findByPk(roleId, {
            include: [
                {
                    model: db.Permission,
                    as: 'permissions',
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'slug', 'module']
                }
            ]
        });

        if (!role) {
            throw new ApiError(404, 'Role not found');
        }

        const permissions = role.permissions || [];

        const modules = [...new Set(permissions.map(p => p.module))];
        console.log(modules);

        return {
            permissions,
            modules
        };
    }



}

module.exports = new RoleService();