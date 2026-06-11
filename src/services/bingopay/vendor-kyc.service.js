// services/bingopay/vendor-kyc.service.js
//
// Offline (manual) vendor KYC: upload documents -> admin reviews each ->
// vendor is approved/rejected via the normal vendor flow. Runs in parallel to
// the Sumsub online flow; a vendor uses one mode or the other.
const db = require('../../models');
const { VendorProfile, VendorKycDocument, PdaUser } = db;
const ApiError = require('../../utils/apiError.util');
const cloudinaryHelper = require('../../utils/cloudinaryHelper.util');

// The document types we accept (also used to build the upload field whitelist).
const DOCUMENT_TYPES = [
    'certificate_of_incorporation',
    'gst_certificate',
    'pan_card',
    'director_id',
    'address_proof',
    'bank_statement',
    'selfie',
    'other'
];

const CLOUD_FOLDER = 'bingold/vendor-kyc';

class VendorKycService {
    get documentTypes() { return DOCUMENT_TYPES; }

    async _getVendor(vendorId) {
        const vendor = await VendorProfile.findByPk(vendorId);
        if (!vendor) throw new ApiError(404, 'Vendor not found');
        return vendor;
    }

    // Submit one or more documents for a vendor.
    //   files: array of { document_type, buffer, originalname, mimetype }
    //   options.adminId: pda_users.id when an admin uploads on the vendor's behalf
    //
    // Re-uploading a document type REPLACES the previous file for that type and
    // resets that document to 'pending'. Submitting documents moves the vendor to
    // kyc_status 'in_progress' (but never downgrades an already-approved vendor).
    async submitDocuments(vendorId, files, options = {}) {
        const vendor = await this._getVendor(vendorId);

        if (!Array.isArray(files) || files.length === 0) {
            throw new ApiError(400, 'At least one KYC document is required');
        }
        for (const f of files) {
            if (!DOCUMENT_TYPES.includes(f.document_type)) {
                throw new ApiError(400, `Invalid document_type '${f.document_type}'. Allowed: ${DOCUMENT_TYPES.join(', ')}`);
            }
            if (!f.buffer || !f.buffer.length) {
                throw new ApiError(400, `Empty file for '${f.document_type}'`);
            }
        }

        const saved = [];
        for (const f of files) {
            // Upload to Cloudinary (resource_type auto handles images + PDFs).
            const result = await cloudinaryHelper.uploadBuffer(f.buffer, CLOUD_FOLDER);

            // One row per document_type per vendor: replace if it exists.
            const existing = await VendorKycDocument.findOne({
                where: { vendor_id: vendor.id, document_type: f.document_type }
            });

            if (existing) {
                await existing.update({
                    file_url: result.secure_url,
                    file_name: f.originalname || null,
                    mime_type: f.mimetype || null,
                    status: 'pending',
                    review_note: null,
                    uploaded_by_admin: options.adminId || null
                });
                saved.push(existing);
            } else {
                const doc = await VendorKycDocument.create({
                    vendor_id: vendor.id,
                    document_type: f.document_type,
                    file_url: result.secure_url,
                    file_name: f.originalname || null,
                    mime_type: f.mimetype || null,
                    status: 'pending',
                    uploaded_by_admin: options.adminId || null
                });
                saved.push(doc);
            }
        }

        // Mark offline mode + move into review, without un-approving an approved vendor.
        const patch = { kyc_mode: 'offline' };
        if (vendor.kyc_status !== 'approved') patch.kyc_status = 'in_progress';
        await vendor.update(patch);

        return { vendor_id: vendor.id, kyc_status: patch.kyc_status || vendor.kyc_status, documents: saved };
    }

    async getDocuments(vendorId) {
        const vendor = await this._getVendor(vendorId);
        const documents = await VendorKycDocument.findAll({
            where: { vendor_id: vendor.id },
            include: [{ model: PdaUser, as: 'uploader', attributes: ['id', 'name', 'email'] }],
            order: [['created_at', 'DESC']]
        });
        return {
            vendor: { id: vendor.id, business_name: vendor.business_name, merchant_code: vendor.merchant_code, kyc_status: vendor.kyc_status, kyc_mode: vendor.kyc_mode },
            documents
        };
    }

    // Normalize multer upload.fields() output (req.files, keyed by field name =
    // document_type) into the array submitDocuments expects. Ignores empty fields.
    filesFromMulter(reqFiles) {
        const out = [];
        if (!reqFiles) return out;
        for (const type of DOCUMENT_TYPES) {
            const arr = reqFiles[type];
            const file = arr && arr[0];
            if (file && file.buffer) {
                out.push({
                    document_type: type,
                    buffer: file.buffer,
                    originalname: file.originalname,
                    mimetype: file.mimetype
                });
            }
        }
        return out;
    }

    // Admin marks a single document approved/rejected.
    async reviewDocument(documentId, status, note) {
        const ALLOWED = ['approved', 'rejected', 'pending'];
        if (!ALLOWED.includes(status)) throw new ApiError(400, `status must be one of: ${ALLOWED.join(', ')}`);
        const doc = await VendorKycDocument.findByPk(documentId);
        if (!doc) throw new ApiError(404, 'Document not found');
        return doc.update({ status, review_note: note || null });
    }
}

module.exports = new VendorKycService();
module.exports.DOCUMENT_TYPES = DOCUMENT_TYPES;
