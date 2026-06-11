// services/bingopay/vendor.service.js
const crypto = require('crypto');
const db = require('../../models');
const { BingopayUser, VendorProfile, KycApplication, PdaUser } = db;
const ApiError = require('../../utils/apiError.util');
const SumsubService = require('./sumsub.service');

const MERCHANT_CODE_PREFIX = 'MER';

function randomDigits(length = 7) {
    const bytes = crypto.randomBytes(length);
    let out = '';
    for (let i = 0; i < length; i++) out += (bytes[i] % 10).toString();
    return out;
}

async function generateMerchantCode() {
    for (let i = 0; i < 10; i++) {
        const code = MERCHANT_CODE_PREFIX + randomDigits(7);
        const exists = await VendorProfile.findOne({ where: { merchant_code: code } });
        if (!exists) return code;
    }
    throw new ApiError(500, 'Could not generate a unique merchant code');
}

class VendorService {
    // Onboard a vendor. Creates (or reuses) the underlying BingoPay user row and
    // a vendor profile in 'pending' state. KYC is run separately via Sumsub.
    async createVendor(data, adminUserId) {
        if (!data.business_name) throw new ApiError(400, 'business_name is required');

        return db.sequelize.transaction(async (t) => {
            let bingopayUser = null;

            if (data.user_id) {
                bingopayUser = await BingopayUser.findByPk(data.user_id, { transaction: t });
                if (!bingopayUser) throw new ApiError(404, 'BingoPay user not found');
            } else if (data.email || data.phone) {
                // Reuse an existing user with the same email, else create one.
                if (data.email) {
                    bingopayUser = await BingopayUser.findOne({ where: { email: data.email }, transaction: t });
                }
                if (!bingopayUser) {
                    bingopayUser = await BingopayUser.create({
                        bingold_user_id: data.bingold_user_id || null,
                        email: data.email || null,
                        phone: data.phone || null,
                        first_name: data.first_name || null,
                        last_name: data.last_name || null,
                        account_type: 'vendor',
                        status: 'pending'
                    }, { transaction: t });
                } else if (bingopayUser.account_type === 'customer') {
                    await bingopayUser.update({ account_type: 'vendor' }, { transaction: t });
                }
            } else {
                throw new ApiError(400, 'Provide user_id, or email/phone to create the vendor user');
            }

            const existingProfile = await VendorProfile.findOne({
                where: { user_id: bingopayUser.id },
                transaction: t
            });
            if (existingProfile) throw new ApiError(409, 'This user already has a vendor profile');

            const merchant_code = await generateMerchantCode();

            const vendor = await VendorProfile.create({
                user_id: bingopayUser.id,
                business_name: data.business_name,
                business_type: data.business_type || null,
                registration_number: data.registration_number || null,
                gst_number: data.gst_number || null,
                pan_number: data.pan_number || null,
                address: data.address || null,
                website: data.website || null,
                annual_turnover: data.annual_turnover || null,
                merchant_code,
                kyc_status: 'pending',
                status: 'pending'
            }, { transaction: t });

            return vendor;
        });
    }

    async getVendorById(id) {
        const vendor = await VendorProfile.findByPk(id, {
            include: [
                { model: BingopayUser, as: 'user' },
                { model: PdaUser, as: 'approver', attributes: ['id', 'name', 'email'] }
            ]
        });
        if (!vendor) throw new ApiError(404, 'Vendor not found');
        return vendor;
    }

    async getVendorList(page = 1, limit = 10, filters = {}) {
        const offset = (page - 1) * limit;
        const where = {};

        if (filters.status) where.status = filters.status;
        if (filters.kyc_status) where.kyc_status = filters.kyc_status;
        if (filters.search) {
            where[db.Sequelize.Op.or] = [
                { business_name: { [db.Sequelize.Op.like]: `%${filters.search}%` } },
                { merchant_code: { [db.Sequelize.Op.like]: `%${filters.search}%` } },
                { gst_number: { [db.Sequelize.Op.like]: `%${filters.search}%` } }
            ];
        }

        const { count, rows } = await VendorProfile.findAndCountAll({
            where,
            include: [{ model: BingopayUser, as: 'user', attributes: ['id', 'email', 'phone', 'status'] }],
            limit,
            offset,
            order: [['created_at', 'DESC']]
        });

        return { total: count, page, totalPages: Math.ceil(count / limit), data: rows };
    }

    async updateVendor(id, data, adminUserId) {
        const vendor = await this.getVendorById(id);

        // Protect identity / lifecycle fields from blind updates.
        const blocked = ['id', 'user_id', 'merchant_code', 'kyc_status', 'status',
            'sumsub_applicant_id', 'approved_by', 'approved_at', 'created_at', 'updated_at'];
        blocked.forEach((f) => delete data[f]);

        return vendor.update(data);
    }

    // Approve a vendor: mark KYC approved + activate. This is the admin gate that
    // (in a later phase) triggers merchant-wallet creation in BinGold.
    async approveVendor(id, adminUserId) {
        const vendor = await this.getVendorById(id);
        if (vendor.status === 'active' && vendor.kyc_status === 'approved') return vendor;

        return vendor.update({
            kyc_status: 'approved',
            status: 'active',
            approved_by: adminUserId,
            approved_at: new Date(),
            rejection_reason: null
        });
    }

    async rejectVendor(id, reason, adminUserId) {
        const vendor = await this.getVendorById(id);
        return vendor.update({
            kyc_status: 'rejected',
            status: 'rejected',
            approved_by: adminUserId,
            approved_at: new Date(),
            rejection_reason: reason || null
        });
    }

    async setStatus(id, status) {
        const ALLOWED = ['pending', 'active', 'suspended', 'rejected'];
        if (!ALLOWED.includes(status)) {
            throw new ApiError(400, `status must be one of: ${ALLOWED.join(', ')}`);
        }
        const vendor = await this.getVendorById(id);
        return vendor.update({ status });
    }

    // Kick off Sumsub KYC for a vendor: create the applicant and persist a KYC
    // application row. Returns the applicant id + a WebSDK access token.
    async initiateKyc(id) {
        const vendor = await this.getVendorById(id);
        const externalUserId = `vendor_${vendor.id}`;

        let applicantId = vendor.sumsub_applicant_id;
        if (!applicantId) {
            const applicant = await SumsubService.createApplicant(externalUserId, {
                email: vendor.user ? vendor.user.email : undefined,
                phone: vendor.user ? vendor.user.phone : undefined
            });
            applicantId = applicant.id;
        }

        const accessToken = await SumsubService.createAccessToken(externalUserId);

        await vendor.update({ sumsub_applicant_id: applicantId, kyc_status: 'in_progress' });

        await KycApplication.create({
            user_id: vendor.user_id,
            vendor_id: vendor.id,
            provider: 'sumsub',
            applicant_id: applicantId,
            review_status: 'init'
        });

        return { applicant_id: applicantId, access_token: accessToken.token, external_user_id: externalUserId };
    }

    // Apply an inbound Sumsub webhook to the matching vendor + KYC application.
    // Safe to call repeatedly (idempotent on status).
    async applyKycWebhook(payload) {
        const applicantId = payload.applicantId;
        const externalUserId = payload.externalUserId;

        let vendor = null;
        if (applicantId) {
            vendor = await VendorProfile.findOne({ where: { sumsub_applicant_id: applicantId } });
        }
        if (!vendor && externalUserId && externalUserId.startsWith('vendor_')) {
            const vid = externalUserId.replace('vendor_', '');
            vendor = await VendorProfile.findByPk(vid);
        }

        const newStatus = SumsubService.mapReviewToKycStatus(payload);

        // Always record the webhook for audit, even if we can't resolve a vendor.
        await KycApplication.create({
            user_id: vendor ? vendor.user_id : null,
            vendor_id: vendor ? vendor.id : null,
            provider: 'sumsub',
            applicant_id: applicantId || null,
            review_status: payload.type || null,
            review_result: payload.reviewResult || null,
            webhook_payload: payload
        });

        if (vendor && newStatus && vendor.kyc_status !== newStatus) {
            const updates = { kyc_status: newStatus };
            if (!vendor.sumsub_applicant_id && applicantId) updates.sumsub_applicant_id = applicantId;
            await vendor.update(updates);

            // Also reflect onto the underlying user.
            if (vendor.user_id) {
                await BingopayUser.update({ kyc_status: newStatus }, { where: { id: vendor.user_id } });
            }
        }

        return { matched: Boolean(vendor), vendor_id: vendor ? vendor.id : null, kyc_status: newStatus };
    }
}

module.exports = new VendorService();
