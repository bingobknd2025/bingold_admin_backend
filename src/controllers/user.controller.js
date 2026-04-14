// controllers/user.controller.js
const UserService = require('../services/user.service');
const EmailService = require("../services/email.service");
const { userCreatedTemplate } = require("../templates/emails/userCreated.template");
class UserController {

    async createUser(req, res, next) {
        try {
            if (!req.user || !req.user.pda_user_id) {
                throw new ApiError(401, 'Unauthorized');
            }

            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                throw new ApiError(
                    400,
                    'name, email and password are required'
                );
            }
            const user = await UserService.createUser(
                req.body,
                req.user.pda_user_id
            );

            await EmailService.sendEmail({
                to: email,
                subject: "Your account has been created",
                html: userCreatedTemplate({
                    name: name,
                    email: email,
                    password,
                    sendPassword: true
                })
            });

            const creator = req.user;

            if (creator) {
                await EmailService.sendEmail({
                    to: creator.email,
                    subject: "New user created",
                    html: userCreatedTemplate({
                        name: creator.name,
                        email: email,
                        isAdminNotification: true
                    })
                });
            }
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role_id: user.role_id,
                    is_active: user.is_active,
                    created_by: user.pda_user_id,
                    updated_by: user.pda_user_id,
                    created_at: user.created_at
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getUsers(req, res, next) {
        try {
            const { page, limit, ...filters } = req.body;
            const result = await UserService.getUsers(
                parseInt(page, 10),
                parseInt(limit, 10),
                filters
            );
            res.json({
                success: true,
                message: 'Users retrieved successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }



    async getUser(req, res, next) {
        try {
            const { id } = req.body;
            const user = await UserService.getUserById(id);
            res.json({
                success: true,
                message: 'User fetch successfully',
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req, res, next) {
        try {
            const { id } = req.body;

            if (!id) {
                throw new ApiError(400, 'User id is required');
            }
            const user = await UserService.updateUser(id, req.body);
            res.json({
                success: true,
                message: 'User updated successfully',
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role_id: user.role_id,
                    is_active: user.is_active
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const { id } = req.body;
            const result = await UserService.deleteUser(id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateUserStatus(req, res, next) {
        try {
            const { status } = req.body;
            const user = await UserService.updateUserStatus(req.params.id, status);
            res.json({
                success: true,
                message: `User ${status ? 'activated' : 'deactivated'} successfully`,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    async getUserPermissions(req, res, next) {
        try {
            const { id } = req.body;
            const permissions = await UserService.getUserPermissions(id);
            res.json({
                success: true,
                data: permissions
            });
        } catch (error) {
            next(error);
        }
    }

    async getMyProfile(req, res, next) {
        try {
            const user = await UserService.getUserById(req.user.pda_user_id);

            const response = {
                id: user.id,
                name: user.name,
                email: user.email,
                profile_image: user.profile_image,
                dob: user.dob,
                aadhaar_number: user.aadhaar_number,
                aadhaar_file: user.aadhaar_file,
                aadhaar_status: user.aadhaar_status,
                role: user.legacy_role,
                role_id: user.role_id,
                role_detail: user.user_role,
                is_active: user.is_active,
                otp_enabled: user.otp_enabled,
                last_login_at: user.last_login_at,
                created_at: user.created_at
            };

            res.json({
                success: true,
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

    async updateMyProfile(req, res, next) {
        try {
            const user = await UserService.updateUserProfile(
                req.user.pda_user_id,
                req.body,
                req.file
            );

            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    profile_image: user.profile_image,
                    dob: user.dob,
                    aadhaar_status: user.aadhaar_status
                }
            });
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new UserController();