// services/user.service.js
const db = require('../models');
const { PdaUser, Role, Permission } = db;

const Hash = require('../utils/hash.util');
const ApiError = require('../utils/apiError.util');

class UserService {
    async createUser(data, requestingUserId) {
        const existingEmail = await PdaUser.findOne({
            where: { email: data.email }
        });
        if (existingEmail) {
            throw new ApiError(409, 'Email already in use');
        }
        let roleId = null;
        if (data.role_id) {
            const permissions = await this.getUserPermissions(requestingUserId);
            const canAssignRole = permissions.some(
                p => p.slug === 'user.assign.role'
            );

            if (!canAssignRole) {
                throw new ApiError(403, 'You are not allowed to assign role');
            }
            const role = await Role.findByPk(data.role_id);
            if (!role) {
                throw new ApiError(404, 'Role not found');
            }
            roleId = data.role_id;
        }
        const hashedPassword = await Hash.hashPassword(data.password);

        const user = await PdaUser.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role_id: roleId,
            is_active: data.is_active !== undefined ? data.is_active : true,
            created_by: requestingUserId,
            updated_by: requestingUserId
        });

        return user;
    }

    async getUserById(id) {
        const user = await db.PdaUser.findByPk(id, {
            include: [
                {
                    model: db.Role,
                    as: 'user_role',
                    attributes: ['id', 'name', 'slug'],
                    // include: [
                    //     {
                    //         model: db.Permission,
                    //         through: { attributes: [] },
                    //         as: 'permissions',
                    //         attributes: ['id', 'name', 'slug', 'module']
                    //     }
                    // ]
                }
            ],
            attributes: { exclude: ['password', 'otp_secret'] }
        });

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        return user;
    }

    async getUsers(page = 1, limit = 10, filters = {}) {
        const offset = (page - 1) * limit;
        const where = {};

        if (filters.search) {
            where[db.Sequelize.Op.or] = [
                { name: { [db.Sequelize.Op.like]: `%${filters.search}%` } },
                { email: { [db.Sequelize.Op.like]: `%${filters.search}%` } }
            ];
        }

        if (filters.role_id) {
            where.role_id = filters.role_id;
        }

        if (filters.is_active !== undefined) {
            where.is_active = filters.is_active === 'true';
        }

        const { count, rows } = await db.PdaUser.findAndCountAll({
            where,
            include: [
                {
                    model: db.Role,
                    as: 'user_role',
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: db.PdaUser,
                    as: 'creator',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: db.PdaUser,
                    as: 'updater',
                    attributes: ['id', 'name', 'email']
                }
            ],
            attributes: [
                'id',
                'name',
                'email',
                'is_active',
                'created_at',
                'updated_at'
            ],
            limit,
            offset,
            order: [['created_at', 'DESC']]
        });

        return {
            total: count,
            page,
            totalPages: Math.ceil(count / limit),
            users: rows
        };
    }




    async updateUser(id, data) {

        const user = await this.getUserById(id);

        if (data.email && data.email !== user.email) {
            const existing = await PdaUser.findOne({
                where: { email: data.email }
            });

            if (existing) {
                throw new ApiError(409, 'Email already in use');
            }
        }

        if (data.password) {
            data.password = await Hash.hashPassword(data.password);
        } else {
            delete data.password;
        }

        if (
            data.role_id !== undefined &&
            data.role_id !== user.role_id
        ) {
            const permissions = await this.getUserPermissions(id);
            const canAssignRole = permissions.some(p => p.slug === 'user.update');

            if (!canAssignRole) {
                throw new ApiError(403, 'You are not allowed to change user role');
            }

            const role = await Role.findByPk(data.role_id);
            if (!role) {
                throw new ApiError(404, 'Role not found');
            }
        }

        return user.update({
            ...data,
            updated_by: id
        });
    }

    async updateUserProfile(id, data, file = null) {
        const user = await this.getUserById(id);

        if (data.email && data.email !== user.email) {
            throw new ApiError(403, 'Email cannot be updated');
        }

        if (data.password) {
            data.password = await Hash.hashPassword(data.password);
        } else {
            delete data.password;
        }

        if (
            data.role_id !== undefined &&
            data.role_id !== user.role_id
        ) {
            const permissions = await this.getUserPermissions(id);
            const canAssignRole = permissions.some(p => p.slug === 'user.update');

            if (!canAssignRole) {
                throw new ApiError(403, 'You are not allowed to change user role');
            }

            const role = await Role.findByPk(data.role_id);
            if (!role) {
                throw new ApiError(404, 'Role not found');
            }
        }

        if (file) {
            data.profile_image = `/uploads/users/${file.filename}`;
        }

        if (data.dob || data.aadhaar_number) {
            data.aadhaar_status = 'pending';
        }

        return user.update({
            ...data,
            updated_by: id
        });
    }

    async deleteUser(id) {
        const user = await this.getUserById(id);
        if (!id) {
            throw new ApiError(404, 'User not found');
        }

        await user.destroy();
        return { success: true, message: 'User deleted successfully' };
    }

    async updateUserStatus(id, status) {
        const user = await this.getUserById(id);
        return user.update({ is_active: status });
    }

    async assignRole(userId, roleId) {
        const user = await PdaUser.findByPk(userId);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        const role = await Role.findByPk(roleId);
        if (!role) {
            throw new ApiError(404, 'Role not found');
        }

        user.role_id = roleId;
        await user.save();

        return PdaUser.findByPk(userId, {
            include: [
                {
                    model: Role,
                    as: 'user_role'
                }
            ]
        });
    }

    async getUserPermissions(userId) {
        const user = await db.PdaUser.findByPk(userId, {
            include: [
                {
                    model: db.Role,
                    as: 'user_role',
                    include: [
                        {
                            model: db.Permission,
                            as: 'permissions',
                            through: { attributes: [] },
                            attributes: ['id', 'name', 'slug', 'module']
                        }
                    ]
                }
            ]
        });

        if (!user || !user.user_role) {
            return [];
        }

        return user.user_role.permissions || [];
    }

}

module.exports = new UserService();