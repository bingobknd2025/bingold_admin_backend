// services/permission.service.js
const db = require('../models');
const { Permission, RolePermission, Sequelize } = db;
const { Op } = Sequelize;

const ApiError = require('../utils/apiError.util');

class PermissionService {
    async createPermission(data) {
        const existing = await Permission.findOne({
            where: {
                [Op.or]: [
                    { slug: data.slug },
                    { name: data.name }
                ]
            }
        });

        if (existing) {
            if (existing.slug === data.slug) {
                throw new ApiError(409, 'Permission slug already exists');
            }
            if (existing.name === data.name) {
                throw new ApiError(409, 'Permission name already exists');
            }
        }

        return Permission.create(data);
    }

    async getPermissions(page, limit, filters = {}) {
        const offset = (page - 1) * limit;
        const where = {};

        if (filters.search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${filters.search}%` } },
                { slug: { [Op.like]: `%${filters.search}%` } },
                { module: { [Op.like]: `%${filters.search}%` } }
            ];
        }

        if (filters.module) {
            where.module = filters.module;
        }

        const { count, rows } = await Permission.findAndCountAll({
            where,
            limit,
            offset,
            order: [['id', 'ASC'], ['name', 'ASC']]
        });

        return {
            total: count,
            page,
            totalPages: Math.ceil(count / limit),
            permissions: rows
        };
    }

    async getPermissionbygroup(filters = {}) {
        // const offset = (page - 1) * limit;
        const where = {};

        if (filters.search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${filters.search}%` } },
                { slug: { [Op.like]: `%${filters.search}%` } },
                { module: { [Op.like]: `%${filters.search}%` } }
            ];
        }

        if (filters.module) {
            where.module = filters.module;
        }

        const { count, rows } = await Permission.findAndCountAll({
            where,
            // limit,
            // offset,
            order: [['module', 'ASC'], ['name', 'ASC']]
        });

        const groupedPermissions = rows.reduce((acc, permission) => {
            const moduleName = permission.module || 'general';

            if (!acc[moduleName]) {
                acc[moduleName] = [];
            }

            acc[moduleName].push(permission);
            return acc;
        }, {});

        return {
            total: count,
            // page,
            // totalPages: Math.ceil(count / Object.keys(groupedPermissions).length),
            permissions: groupedPermissions
        };
    }

    async checkUserPermission(userId, permissionSlug) {
        const user = await db.PdaUser.findByPk(userId, {
            include: [{
                model: db.Role,
                as: 'user_role',
                include: [{
                    model: db.Permission,
                    as: 'permissions',
                    through: { attributes: [] }
                }]
            }]
        });

        if (!user || !user.user_role) {
            return false;
        }

        const permissions = user.user_role.permissions || [];

        return permissions.some(
            p => p && p.slug === permissionSlug
        );
    }

    async getUserPermissions(userId) {
        const user = await db.PdaUser.findByPk(userId, {
            include: [{
                model: db.Role,
                as: 'user_role',
                include: [{
                    model: db.Permission,
                    as: 'permissions',
                    through: { attributes: [] }
                }]
            }]
        });

        if (!user || !user.user_role) {
            return [];
        }

        return (user.user_role.permissions || [])
            .filter(Boolean)
            .map(p => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                module: p.module
            }));
    }

    async getPermissionById(id) {
        const permission = await Permission.findByPk(id);
        if (!permission) {
            throw new ApiError(404, 'Permission not found');
        }
        return permission;
    }

    async updatePermission(id, data) {
        const permission = await this.getPermissionById(id);

        if (data.slug && data.slug !== permission.slug) {
            const existing = await Permission.findOne({
                where: { slug: data.slug }
            });

            if (existing) {
                throw new ApiError(409, 'Permission slug already exists');
            }
        }

        return permission.update(data);
    }

    async deletePermission(id) {
        const permission = await this.getPermissionById(id);

        const roleCount = await RolePermission.count({
            where: { permission_id: id }
        });

        if (roleCount > 0) {
            throw new ApiError(400, 'Cannot delete permission assigned to roles');
        }

        await permission.destroy();
        return { success: true, message: 'Permission deleted successfully' };
    }

    async getPermissionModules() {
        const modules = await Permission.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('module')), 'module']
            ],
            order: [['module', 'ASC']]
        });

        return modules.map(m => m.module);
    }

    async getPermissionsByModule(module) {
        return Permission.findAll({
            where: { module },
            order: [['name', 'ASC']]
        });
    }
}

module.exports = new PermissionService();