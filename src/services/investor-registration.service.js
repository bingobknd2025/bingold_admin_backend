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

// Document types a company may submit. The user picks a type on the investor-ui
// and uploads a file against it, so this list is mirrored in that app's
// adminBackend.config.ts — the two must agree, since doc_type doubles as the
// multipart field name.
const DOCUMENT_TYPES = [
    { doc_type: 'certificate_of_incorporation', label: 'Certificate of Incorporation' },
    { doc_type: 'certificate_of_good_standing', label: 'Certificate of Good Standing' },
    { doc_type: 'business_registration_certificate', label: 'Business Registration Certificate' },
    { doc_type: 'tax_registration_certificate', label: 'Tax Registration Certificate' },
    { doc_type: 'proof_of_business_address', label: 'Proof of Business Address' },
    { doc_type: 'memorandum_articles_of_association', label: 'Memorandum & Articles of Association' },
    { doc_type: 'bank_statement_or_letter', label: 'Bank Statement / Bank Letter' },
    { doc_type: 'business_license', label: 'Business License' }
];

const DOCUMENT_TYPE_LABELS = DOCUMENT_TYPES.reduce((acc, type) => {
    acc[type.doc_type] = type.label;
    return acc;
}, {});

/** At least this many documents must accompany a company registration. */
const MIN_DOCUMENTS = 1;

// Company profile fields. `required` mirrors the investor-ui form, so a payload
// that bypasses the browser is rejected the same way.
const COMPANY_FIELDS = [
    { key: 'legalCompanyName', column: 'legal_company_name', label: 'Legal Company Name', required: true, maxLength: 150 },
    { key: 'tradingName', column: 'trading_name', label: 'Trading Name / DBA', required: false, maxLength: 150 },
    { key: 'legalEntityType', column: 'legal_entity_type', label: 'Legal Entity Type', required: true, maxLength: 100 },
    { key: 'countryOfIncorporation', column: 'country_of_incorporation', label: 'Country of Incorporation', required: true, maxLength: 100 },
    { key: 'registrationNumber', column: 'registration_number', label: 'Registration Number', required: true, maxLength: 50 },
    { key: 'taxIdentificationNumber', column: 'tax_identification_number', label: 'Tax Identification Number', required: true, maxLength: 50 },
    { key: 'dateOfIncorporation', column: 'date_of_incorporation', label: 'Date of Incorporation', required: true },
    { key: 'industry', column: 'industry', label: 'Industry', required: true, maxLength: 150 },
    { key: 'businessDescription', column: 'business_description', label: 'Business Description', required: true, maxLength: 500 },
    { key: 'companyWebsite', column: 'company_website', label: 'Company Website', required: false, maxLength: 200 }
];

const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB — mirrored by DOCUMENT_MAX_SIZE in the investor UI

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

/**
 * Validate and normalise the company profile. Throws on the first problem so
 * the investor UI can surface a message the user can act on.
 */
const parseCompanyDetails = (raw) => {
    let details = raw;

    if (typeof details === 'string') {
        try {
            details = JSON.parse(details);
        } catch (_) {
            throw new ApiError(400, 'Company details are malformed');
        }
    }
    if (!details || typeof details !== 'object') {
        throw new ApiError(400, 'Company details are required');
    }

    const columns = {};

    for (const field of COMPANY_FIELDS) {
        const value = typeof details[field.key] === 'string'
            ? details[field.key].trim()
            : details[field.key];

        if (value === undefined || value === null || value === '') {
            if (field.required) throw new ApiError(400, `${field.label} is required`);
            columns[field.column] = null;
            continue;
        }
        if (field.maxLength && String(value).length > field.maxLength) {
            throw new ApiError(400, `${field.label} must be ${field.maxLength} characters or fewer`);
        }
        columns[field.column] = value;
    }

    // Date of incorporation must be a real date, and not in the future.
    const incorporated = new Date(columns.date_of_incorporation);
    if (Number.isNaN(incorporated.getTime())) {
        throw new ApiError(400, 'Date of Incorporation is not a valid date');
    }
    if (incorporated > new Date()) {
        throw new ApiError(400, 'Date of Incorporation cannot be in the future');
    }
    columns.date_of_incorporation = incorporated.toISOString().slice(0, 10);

    if (columns.company_website && !/^(https?:\/\/)?([\w-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/.test(columns.company_website)) {
        throw new ApiError(400, 'Company Website is not a valid URL');
    }

    return columns;
};

class InvestorRegistrationService {
    get DOCUMENT_TYPES() { return DOCUMENT_TYPES; }
    get COMPANY_FIELDS() { return COMPANY_FIELDS; }
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
            document_types: DOCUMENT_TYPES
        };
    }

    // ── Document upload ──────────────────────────────────────────────
    // `files` is multer's req.files, keyed by doc_type. Buffers go to the same
    // Cloudinary account the rest of the admin backend uses.
    // `files` is multer's req.files, keyed by doc_type. `documentTypes` is the
    // list of types the user actually attached.
    async saveDocuments(email, companyDetails, documentTypes, files = {}) {
        const normalized = normalizeEmail(email);
        if (!normalized) throw new ApiError(400, 'email is required');

        let row = await TemporaryInvestorRegistration.findOne({ where: { email: normalized } });

        // Self-heal a missing row rather than dead-ending the user.
        //
        // The capture call at signup is fire-and-forget by design, so that a
        // capture failure can never block the signup itself. When it does fail,
        // the investor UI still sends the user here (that decision is made from
        // the form, locally), and a hard 404 would leave them permanently
        // unable to submit with no way to recover. Reaching this point means
        // they are an authenticated company completing registration, so the row
        // is created from what they submitted.
        if (!row) {
            row = await TemporaryInvestorRegistration.create({
                email: normalized,
                account_type: 'company',
                status: STATUS.PENDING_DOCUMENTS,
                source: 'investor-ui',
                meta: { recovered_at_submission: true }
            });
        } else if (row.account_type !== 'company') {
            throw new ApiError(400, 'Company registration is only collected for company accounts');
        }

        // Validate the profile before touching storage — no point uploading
        // files for a submission that will be rejected.
        const details = parseCompanyDetails(companyDetails);

        let types = documentTypes;
        if (typeof types === 'string') {
            try {
                types = JSON.parse(types);
            } catch (_) {
                types = [];
            }
        }
        if (!Array.isArray(types)) types = [];

        // Keep only known types, de-duplicated, that actually arrived with a file.
        types = [...new Set(types)].filter((type) => DOCUMENT_TYPE_LABELS[type]);

        if (types.length < MIN_DOCUMENTS) {
            throw new ApiError(400, `Attach at least ${MIN_DOCUMENTS} document before submitting`);
        }

        const uploaded = [];
        for (const docType of types) {
            const file = files[docType] && files[docType][0];
            const label = DOCUMENT_TYPE_LABELS[docType];

            if (!file) {
                throw new ApiError(400, `${label}: file is missing`);
            }
            if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
                throw new ApiError(400, `${label}: only PDF, JPG and PNG files are accepted`);
            }
            if (file.size > MAX_FILE_SIZE) {
                throw new ApiError(400, `${label}: file must be 5MB or smaller`);
            }

            const result = await storeDocument(file.buffer, docType, file.originalname);

            uploaded.push({
                doc_type: docType,
                label,
                url: result.secure_url,
                public_id: result.public_id,
                file_name: file.originalname,
                mime_type: file.mimetype,
                size: file.size,
                uploaded_at: new Date().toISOString()
            });
        }

        await row.update({
            ...details,
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
                { ref_code: like },
                { legal_company_name: like },
                { registration_number: like }
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
            document_types: DOCUMENT_TYPES
        };
    }
}

module.exports = new InvestorRegistrationService();
