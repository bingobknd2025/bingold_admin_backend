// services/contact-request.service.js
//
// "Contact us" ticket capture. The submit path is reachable by anyone on the
// internet (no api-key, no JWT), so ALL validation and trimming happens here —
// the controller does no shaping of its own.
//
// Scope is deliberately small: capture a request, list it, move it through a
// status. Replies to the requester happen out of band (email/phone), so this
// service stores no thread and sends no mail.
const crypto = require('crypto');

const db = require('../models');
const { ContactRequest, PdaUser, Sequelize } = db;
const { Op } = Sequelize;

const ApiError = require('../utils/apiError.util');

const STATUSES = ['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

// Column caps from contact_request.model.js. Enforced here so an oversized
// field is a clean 400 rather than a MySQL truncation error at insert time.
const LIMITS = {
    name: 150,
    email: 255,
    subject: 255,
    message: 5000,
    source: 50
};

// Intentionally permissive — just enough to reject obvious junk. Bounded to
// avoid catastrophic backtracking on hostile input.
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[A-Za-z]{2,24}$/;

const asTrimmedString = (value) => (typeof value === 'string' ? value.trim() : '');

/**
 * Validate one required text field and return the trimmed value.
 * Throws ApiError(400) on missing/oversized input.
 */
const requireField = (value, field, max) => {
    const trimmed = asTrimmedString(value);
    if (!trimmed) throw new ApiError(400, `${field} is required`);
    if (trimmed.length > max) {
        throw new ApiError(400, `${field} must be ${max} characters or fewer`);
    }
    return trimmed;
};

/** CT-20260807-7F3A9C — date-stamped so refs are roughly sortable by eye. */
const buildTicketRef = () => {
    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `CT-${stamp}-${random}`;
};

class ContactRequestService {
    get STATUSES() {
        return STATUSES;
    }

    /**
     * Store a public submission.
     *
     * @param {object} payload  name / email / subject / message / source
     * @param {object} context  { ip, userAgent } — abuse triage only
     */
    async submit(payload = {}, context = {}) {
        const name = requireField(payload.name, 'Name', LIMITS.name);
        const email = requireField(payload.email, 'Email', LIMITS.email).toLowerCase();
        const subject = requireField(payload.subject, 'Subject', LIMITS.subject);
        const message = requireField(payload.message, 'Message', LIMITS.message);

        if (!EMAIL_RE.test(email)) throw new ApiError(400, 'A valid email address is required');

        const source = asTrimmedString(payload.source).slice(0, LIMITS.source) || 'website';

        // ticket_ref is UNIQUE; 3 random bytes within one day collides rarely,
        // but retry rather than 500 on the caller if it ever does.
        for (let attempt = 0; attempt < 3; attempt += 1) {
            try {
                const row = await ContactRequest.create({
                    ticket_ref: buildTicketRef(),
                    name,
                    email,
                    subject,
                    message,
                    source,
                    status: 'NEW',
                    ip_address: (context.ip || '').slice(0, 45) || null,
                    user_agent: (context.userAgent || '').slice(0, 255) || null
                });

                // Only the reference goes back — never echo the stored row to an
                // unauthenticated caller.
                return { ticket_ref: row.ticket_ref, status: row.status };
            } catch (error) {
                if (error instanceof Sequelize.UniqueConstraintError && attempt < 2) continue;
                throw error;
            }
        }

        throw new ApiError(500, 'Could not allocate a ticket reference, please retry');
    }

    async getList(page = 1, limit = 10, filters = {}) {
        const offset = (page - 1) * limit;
        const where = {};

        if (filters.search) {
            const like = { [Op.like]: `%${filters.search}%` };
            where[Op.or] = [
                { ticket_ref: like },
                { name: like },
                { email: like },
                { subject: like },
                { message: like }
            ];
        }
        if (filters.status) {
            if (!STATUSES.includes(filters.status)) {
                throw new ApiError(400, `status must be one of: ${STATUSES.join(', ')}`);
            }
            where.status = filters.status;
        }
        if (filters.source) where.source = filters.source;

        const { count, rows } = await ContactRequest.findAndCountAll({
            where,
            limit,
            offset,
            order: [['created_at', 'DESC']],
            include: [{ model: PdaUser, as: 'resolver', attributes: ['id', 'name', 'email'], required: false }]
        });

        return {
            total: count,
            page,
            totalPages: Math.ceil(count / limit) || 1,
            requests: rows.map((row) => {
                const plain = row.get({ plain: true });
                return {
                    ...plain,
                    // The list is a scan view — keep the payload small and let
                    // /view return the full message.
                    message: plain.message && plain.message.length > 180
                        ? `${plain.message.slice(0, 180)}…`
                        : plain.message
                };
            })
        };
    }

    /** Counts per status, for the admin list header. */
    async getCounts() {
        const rows = await ContactRequest.findAll({
            attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
            group: ['status']
        });

        const counts = STATUSES.reduce((acc, status) => ({ ...acc, [status]: 0 }), {});
        rows.forEach((row) => {
            const plain = row.get({ plain: true });
            counts[plain.status] = Number(plain.count) || 0;
        });
        counts.TOTAL = Object.values(counts).reduce((sum, n) => sum + n, 0);
        return counts;
    }

    async getById(id) {
        const row = await ContactRequest.findByPk(id, {
            include: [{ model: PdaUser, as: 'resolver', attributes: ['id', 'name', 'email'], required: false }]
        });
        if (!row) throw new ApiError(404, 'Contact request not found');
        return row.get({ plain: true });
    }

    /**
     * Move a request through the workflow.
     *
     * @param {number} id
     * @param {string} status      one of STATUSES
     * @param {string} adminNote   optional internal note
     * @param {number} adminUserId req.user.pda_user_id
     */
    async updateStatus(id, status, adminNote, adminUserId) {
        if (!id) throw new ApiError(400, 'Contact request id is required');
        if (!STATUSES.includes(status)) {
            throw new ApiError(400, `status must be one of: ${STATUSES.join(', ')}`);
        }

        const row = await ContactRequest.findByPk(id);
        if (!row) throw new ApiError(404, 'Contact request not found');

        const isSettled = status === 'RESOLVED' || status === 'CLOSED';

        const updates = {
            status,
            // Stamp who settled it and when; clear both if it is reopened, so the
            // fields never describe a state the row is no longer in.
            resolved_at: isSettled ? new Date() : null,
            resolved_by: isSettled ? adminUserId || null : null
        };

        if (adminNote !== undefined) {
            const note = asTrimmedString(adminNote);
            updates.admin_note = note || null;
        }

        await row.update(updates);
        return this.getById(id);
    }

    async remove(id) {
        if (!id) throw new ApiError(400, 'Contact request id is required');
        const row = await ContactRequest.findByPk(id);
        if (!row) throw new ApiError(404, 'Contact request not found');
        await row.destroy();
        return { id };
    }
}

module.exports = new ContactRequestService();
