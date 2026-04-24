// services/agent.service.js
const crypto = require('crypto');
const QRCode = require('qrcode');
const db = require('../models');
const { Agent, AgentScanLog, PdaUser } = db;
const ApiError = require('../utils/apiError.util');
const cloudinaryHelper = require('../utils/cloudinaryHelper.util');

const CODE_PREFIX = 'BING-AGT-';

function randomCodeSegment(length = 6) {
    // unambiguous chars (no 0/O/1/I)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let out = '';
    const bytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        out += chars[bytes[i] % chars.length];
    }
    return out;
}

async function generateUniqueCode() {
    for (let i = 0; i < 10; i++) {
        const code = CODE_PREFIX + randomCodeSegment(6);
        const exists = await Agent.findOne({ where: { unique_code: code } });
        if (!exists) return code;
    }
    throw new ApiError(500, 'Could not generate a unique agent code');
}

function buildVerifyUrl(code) {
    // Prefer a frontend URL (PUBLIC_VERIFY_BASE_URL) if you have a UI page,
    // otherwise fall back to the API host so the QR still resolves to the
    // built-in HTML verification card at /verify/:code.
    const base =
        process.env.PUBLIC_VERIFY_BASE_URL ||
        process.env.PUBLIC_APP_URL ||
        process.env.API_BASE_URL ||
        '';
    if (!base) return code;
    return `${base.replace(/\/$/, '')}/verify/${code}`;
}

async function uploadQrForCode(code) {
    const verifyUrl = buildVerifyUrl(code);
    const buffer = await QRCode.toBuffer(verifyUrl, {
        type: 'png',
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 400
    });
    const result = await cloudinaryHelper.uploadBuffer(buffer, 'bingold/agents/qr');
    return result.secure_url;
}

class AgentService {
    async createAgent(data, userId) {
        const unique_code = await generateUniqueCode();
        const qr_code = await uploadQrForCode(unique_code);

        const agent = await Agent.create({
            name: data.name,
            role: data.role || null,
            region: data.region || null,
            unique_code,
            qr_code,
            photo: data.photo || null,
            expiry_date: data.expiry_date || null,
            status: data.status || 'active',
            created_by: userId,
            updated_by: userId
        });

        return agent;
    }

    async getAgentById(id) {
        const agent = await Agent.findByPk(id, {
            include: [
                { model: PdaUser, as: 'creator', attributes: ['id', 'name', 'email'] },
                { model: PdaUser, as: 'updater', attributes: ['id', 'name', 'email'] }
            ]
        });
        if (!agent) throw new ApiError(404, 'Agent not found');
        return agent;
    }

    async getAgentList(page = 1, limit = 10, filters = {}) {
        const offset = (page - 1) * limit;
        const where = {};

        if (filters.search) {
            where[db.Sequelize.Op.or] = [
                { name: { [db.Sequelize.Op.like]: `%${filters.search}%` } },
                { unique_code: { [db.Sequelize.Op.like]: `%${filters.search}%` } },
                { region: { [db.Sequelize.Op.like]: `%${filters.search}%` } }
            ];
        }
        if (filters.status) where.status = filters.status;
        if (filters.region) where.region = filters.region;

        const { count, rows } = await Agent.findAndCountAll({
            where,
            include: [
                { model: PdaUser, as: 'creator', attributes: ['id', 'name', 'email'] }
            ],
            limit,
            offset,
            order: [['created_at', 'DESC']]
        });

        return {
            total: count,
            page,
            totalPages: Math.ceil(count / limit),
            data: rows
        };
    }

    async updateAgent(id, data, userId) {
        const agent = await this.getAgentById(id);

        delete data.id;
        delete data.unique_code;
        delete data.qr_code;
        delete data.created_by;
        delete data.created_at;
        delete data.updated_at;

        data.updated_by = userId;

        return agent.update(data);
    }

    async regenerateQr(id) {
        const agent = await this.getAgentById(id);
        const qr_code = await uploadQrForCode(agent.unique_code);
        return agent.update({ qr_code });
    }

    async deleteAgent(id) {
        const agent = await this.getAgentById(id);
        await agent.destroy();
        return { success: true, message: 'Agent deleted successfully' };
    }

    // ─── Public verification ──────────────────────────────────
    async verifyAgentByCode(code, scanContext = {}) {
        if (!code) throw new ApiError(400, 'Agent code is required');

        const agent = await Agent.findOne({ where: { unique_code: code } });

        if (!agent) {
            return { state: 'invalid', agent: null };
        }

        // log every lookup attempt that resolves to an agent
        try {
            await AgentScanLog.create({
                agent_id: agent.id,
                ip: scanContext.ip || null,
                user_agent: scanContext.user_agent ? String(scanContext.user_agent).slice(0, 500) : null,
                scanned_at: new Date()
            });
        } catch (_) { /* logging must never break verification */ }

        if (agent.status !== 'active') {
            return { state: 'inactive', agent: this._publicShape(agent) };
        }

        if (agent.expiry_date && new Date(agent.expiry_date) < new Date(new Date().toDateString())) {
            return { state: 'expired', agent: this._publicShape(agent) };
        }

        return { state: 'verified', agent: this._publicShape(agent) };
    }

    _publicShape(agent) {
        // Only expose fields safe for public verification
        return {
            name: agent.name,
            role: agent.role,
            region: agent.region,
            unique_code: agent.unique_code,
            photo: agent.photo,
            status: agent.status,
            expiry_date: agent.expiry_date
        };
    }
}

module.exports = new AgentService();
