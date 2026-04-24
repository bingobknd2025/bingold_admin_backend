// controllers/agent.controller.js
// Photo handling: clients upload the image via the common upload API
// (POST /api/bingold/admin/common/upload-file) and send the returned URL
// as the `photo` field in the JSON body here.
const AgentService = require('../services/agent.service');
const ApiError = require('../utils/apiError.util');

const ALLOWED_STATUSES = ['active', 'inactive'];

class AgentController {
    async createAgent(req, res, next) {
        try {
            if (!req.user || !req.user.pda_user_id) {
                throw new ApiError(401, 'Unauthorized');
            }

            const { name, status } = req.body;
            if (!name) throw new ApiError(400, 'name is required');
            if (status && !ALLOWED_STATUSES.includes(status)) {
                throw new ApiError(400, `status must be one of: ${ALLOWED_STATUSES.join(', ')}`);
            }

            const agent = await AgentService.createAgent(req.body, req.user.pda_user_id);

            res.status(201).json({
                success: true,
                message: 'Agent created successfully',
                data: agent
            });
        } catch (error) {
            next(error);
        }
    }

    async getAgentList(req, res, next) {
        try {
            const { page, limit, ...filters } = req.body;
            const result = await AgentService.getAgentList(
                parseInt(page, 10) || 1,
                parseInt(limit, 10) || 10,
                filters
            );
            res.json({
                success: true,
                message: 'Agents retrieved successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getAgent(req, res, next) {
        try {
            const { id } = req.body;
            if (!id) throw new ApiError(400, 'Agent id is required');
            const agent = await AgentService.getAgentById(id);
            res.json({
                success: true,
                message: 'Agent fetched successfully',
                data: agent
            });
        } catch (error) {
            next(error);
        }
    }

    async updateAgent(req, res, next) {
        try {
            if (!req.user || !req.user.pda_user_id) {
                throw new ApiError(401, 'Unauthorized');
            }

            const { id, status } = req.body;
            if (!id) throw new ApiError(400, 'Agent id is required');
            if (status && !ALLOWED_STATUSES.includes(status)) {
                throw new ApiError(400, `status must be one of: ${ALLOWED_STATUSES.join(', ')}`);
            }

            const agent = await AgentService.updateAgent(id, req.body, req.user.pda_user_id);
            res.json({
                success: true,
                message: 'Agent updated successfully',
                data: agent
            });
        } catch (error) {
            next(error);
        }
    }

    async regenerateQr(req, res, next) {
        try {
            const { id } = req.body;
            if (!id) throw new ApiError(400, 'Agent id is required');
            const agent = await AgentService.regenerateQr(id);
            res.json({
                success: true,
                message: 'QR code regenerated successfully',
                data: agent
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteAgent(req, res, next) {
        try {
            const { id } = req.body;
            if (!id) throw new ApiError(400, 'Agent id is required');
            const result = await AgentService.deleteAgent(id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AgentController();
