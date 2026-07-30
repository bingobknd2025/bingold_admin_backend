// services/investor-registration.service.js
//
// Capture layer for investor-ui (ICO) signups. The investor backend that
// investor-ui authenticates against is external and cannot be modified, so:
//   • the account type chosen at signup, and
//   • the company registration documents collected after OTP verification
// are stored here, keyed by email.
//
// Nothing in here is authoritative for investor identity or auth — it is a
// staging/compliance capture that the admin panel reads.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const db = require('../models');
const { TemporaryInvestorRegistration, Sequelize } = db;
const { Op } = Sequelize;

const ApiError = require('../utils/apiError.util');
const cloudinaryHelper = require('../utils/cloudinaryHelper.util');

const CLOUD_FOLDER = 'bingold/investor-registrations';

// Local-disk fallback, used only when Cloudinary is not configured (i.e. local
// development). Production always has CLOUDINARY_* set and never touches this.
const LOCAL_UPLOAD_ROOT = path.join(process.cwd(), 'uploads', 'investor-registrations');

const isCloudinaryConfigured = () => Boolean(process.env.CLOUDINARY_CLOUD_NAME);

const storeLocally = (buffer, docType, originalName) => {
    const dir = path.join(LOCAL_UPLOAD_ROOT, docType);
    fs.mkdirSync(dir, { recursive: true });

    const extension = path.extname(originalName || '') || '.bin';
    const fileName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${extension}`;
    fs.writeFileSync(path.join(dir, fileName), buffer);

    const relative = `uploads/investor-registrations/${docType}/${fileName}`;
    const base = (process.env.SELF_BASE_URL || `http://localhost:${process.env.PORT || 5000}`)
        .replace(/\/+$/, '');

    return { secure_url: `${base}/${relative}`, public_id: relative };
};

/** Push one document to Cloudinary, or to disk when running without it. */
const storeDocument = async (buffer, docType, originalName) => {
    if (!isCloudinaryConfigured()) {
        return storeLocally(buffer, docType, originalName);
    }
    return cloudinaryHelper.uploadBuffer(buffer, `${CLOUD_FOLDER}/${docType}`);
};

const ACCOUNT_TYPES = ['individual', 'company'];

const STATUS = {
    PENDING_OTP: 'PENDING_OTP',
    PENDING_DOCUMENTS: 'PENDING_DOCUMENTS',
    DOCS_SUBMITTED: 'DOCS_SUBMITTED',
    COMPLETED: 'COMPLETED'
};

// Internationally accepted company registration documents. The investor-ui
// renders its upload fields from this same list (mirrored in its config file),
// so adding a fourth document is a one-line change on each side.
const REQUIRED_DOCUMENTS = [
    {
        doc_type: 'certificate_of_incorporation',
        label: 'Certificate of Incorporation',
        hint: 'Or equivalent business registration certificate'
    },
    {
        doc_type: 'articles_of_association',
        label: 'Memorandum & Articles of Association',
        hint: 'Or the constitutional document of the entity'
    },
    {
        doc_type: 'proof_of_business_address',
        label: 'Proof of Business Address',
        hint: 'Utility bill or bank statement, not older than 3 months'
    }
];

const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

class InvestorRegistrationService {
    get REQUIRED_DOCUMENTS() { return REQUIRED_DOCUMENTS; }
    get STATUS() { return STATUS; }

    // ── Capture ──────────────────────────────────────────────────────
    // Called by investor-ui right after the investor backend accepted the
    // signup. Upsert on email: a user who re-signs-up before verifying simply
    // replaces their pending row. Documents already collected are never lost.
    async capture(payload = {}) {
        const email = normalizeEmail(payload.email);
        if (!email) throw new ApiError(400, 'email is required');

        const accountType = ACCOUNT_TYPES.includes(payload.account_type)
            ? payload.account_type
            : 'individual';

        const fields = {
            email,
            account_type: accountType,
            first_name: payload.first_name || null,
            last_name: payload.last_name || null,
            phone: payload.phone || null,
            country: payload.country || null,
            ref_code: payload.ref_code || null,
            source: payload.source || 'investor-ui',
            meta: payload.meta || null
        };

        const existing = await TemporaryInvestorRegistration.findOne({ where: { email } });

        if (!existing) {
            const created = await TemporaryInvestorRegistration.create({
                ...fields,
                status: STATUS.PENDING_OTP
            });
            return { id: created.id, email: created.email, account_type: created.account_type, status: created.status };
        }

        // Keep an already-submitted document set (and its status) intact; only
        // refresh the profile fields and the chosen account type.
        const keepStatus = existing.status === STATUS.DOCS_SUBMITTED;
        await existing.update({
            ...fields,
            status: keepStatus ? existing.status : STATUS.PENDING_OTP
        });

        return { id: existing.id, email: existing.email, account_type: existing.account_type, status: existing.status };
    }

    // ── OTP verified ─────────────────────────────────────────────────
    // A company still owes us documents; an individual is done.
    async markVerified(email) {
        const normalized = normalizeEmail(email);
        if (!normalized) throw new ApiError(400, 'email is required');

        const row = await TemporaryInvestorRegistration.findOne({ where: { email: normalized } });
        if (!row) return { found: false };

        if (row.status !== STATUS.DOCS_SUBMITTED) {
            const next = row.account_type === 'company'
                ? STATUS.PENDING_DOCUMENTS
                : STATUS.COMPLETED;
            await row.update({ status: next });
        }

        return {
            found: true,
            account_type: row.account_type,
            status: row.status,
            documents_required: row.account_type === 'company' && row.status === STATUS.PENDING_DOCUMENTS
        };
    }

    // ── Status lookup (used by the investor-ui login gate) ────────────
    // Returns only what the redirect decision needs — never document URLs.
    async getStatus(email) {
        const normalized = normalizeEmail(email);
        if (!normalized) throw new ApiError(400, 'email is required');

        const row = await TemporaryInvestorRegistration.findOne({
            where: { email: normalized },
            attributes: ['id', 'email', 'account_type', 'status', 'documents_submitted_at']
        });

        if (!row) {
            return { found: false, account_type: null, status: null, documents_required: false };
        }

        const documentsRequired =
            row.account_type === 'company' &&
            row.status !== STATUS.DOCS_SUBMITTED;

        return {
            found: true,
            account_type: row.account_type,
            status: row.status,
            documents_required: documentsRequired,
            documents_submitted_at: row.documents_submitted_at,
            required_documents: REQUIRED_DOCUMENTS
        };
    }

    // ── Document upload ──────────────────────────────────────────────
    // `files` is multer's req.files, keyed by doc_type. Buffers go to the same
    // Cloudinary account the rest of the admin backend uses.
    async saveDocuments(email, files = {}) {
        const normalized = normalizeEmail(email);
        if (!normalized) throw new ApiError(400, 'email is required');

        const row = await TemporaryInvestorRegistration.findOne({ where: { email: normalized } });
        if (!row) throw new ApiError(404, 'No investor registration found for this email');
        if (row.account_type !== 'company') {
            throw new ApiError(400, 'Documents are only collected for company registrations');
        }

        const missing = REQUIRED_DOCUMENTS
            .filter((doc) => !files[doc.doc_type] || !files[doc.doc_type][0])
            .map((doc) => doc.label);

        if (missing.length) {
            throw new ApiError(400, `Missing required document(s): ${missing.join(', ')}`);
        }

        const uploaded = [];
        for (const doc of REQUIRED_DOCUMENTS) {
            const file = files[doc.doc_type][0];

            if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
                throw new ApiError(400, `${doc.label}: only PDF, JPG and PNG files are accepted`);
            }
            if (file.size > MAX_FILE_SIZE) {
                throw new ApiError(400, `${doc.label}: file must be 10MB or smaller`);
            }

            const result = await storeDocument(
                file.buffer,
                doc.doc_type,
                file.originalname
            );

            uploaded.push({
                doc_type: doc.doc_type,
                label: doc.label,
                url: result.secure_url,
                public_id: result.public_id,
                file_name: file.originalname,
                mime_type: file.mimetype,
                size: file.size,
                uploaded_at: new Date().toISOString()
            });
        }

        await row.update({
            documents: uploaded,
            documents_submitted_at: new Date(),
            status: STATUS.DOCS_SUBMITTED
        });

        return {
            id: row.id,
            email: row.email,
            status: row.status,
            documents_count: uploaded.length
        };
    }

    // ── Admin queries ────────────────────────────────────────────────
    async getList(page = 1, limit = 10, filters = {}) {
        const offset = (page - 1) * limit;
        const where = {};

        if (filters.search) {
            const like = { [Op.like]: `%${filters.search}%` };
            where[Op.or] = [
                { email: like },
                { first_name: like },
                { last_name: like },
                { phone: like },
                { ref_code: like }
            ];
        }
        if (filters.account_type) where.account_type = filters.account_type;
        if (filters.status) where.status = filters.status;

        const { count, rows } = await TemporaryInvestorRegistration.findAndCountAll({
            where,
            limit,
            offset,
            order: [['created_at', 'DESC']]
        });

        return {
            total: count,
            page,
            totalPages: Math.ceil(count / limit) || 1,
            registrations: rows.map((row) => {
                const plain = row.get({ plain: true });
                return {
                    ...plain,
                    documents_count: Array.isArray(plain.documents) ? plain.documents.length : 0
                };
            })
        };
    }

    async getById(id) {
        const row = await TemporaryInvestorRegistration.findByPk(id);
        if (!row) throw new ApiError(404, 'Investor registration not found');

        const plain = row.get({ plain: true });
        return {
            ...plain,
            documents: Array.isArray(plain.documents) ? plain.documents : [],
            required_documents: REQUIRED_DOCUMENTS
        };
    }
}

module.exports = new InvestorRegistrationService();
