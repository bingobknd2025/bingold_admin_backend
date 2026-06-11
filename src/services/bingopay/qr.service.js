// services/bingopay/qr.service.js
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const db = require('../../models');
const { PaymentQrCode, VendorProfile } = db;
const ApiError = require('../../utils/apiError.util');
const cloudinaryHelper = require('../../utils/cloudinaryHelper.util');

// The deep link a payer's app opens when scanning. The BingoPay client app
// resolves /pay/:qr_uuid to fetch merchant + amount and run the payment.
function buildPayUrl(qrUuid) {
    const base = (
        process.env.PUBLIC_PAY_BASE_URL ||
        process.env.PUBLIC_APP_URL ||
        'https://www.bingold.to'
    ).replace(/\/$/, '');
    return `${base}/pay/${qrUuid}`;
}

async function renderQrImage(qrUuid) {
    const buffer = await QRCode.toBuffer(buildPayUrl(qrUuid), {
        type: 'png',
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 400
    });
    const result = await cloudinaryHelper.uploadBuffer(buffer, 'bingold/payments/qr');
    return result.secure_url;
}

class QrService {
    async createQr(data, adminUserId) {
        if (!data.vendor_id) throw new ApiError(400, 'vendor_id is required');

        const vendor = await VendorProfile.findByPk(data.vendor_id);
        if (!vendor) throw new ApiError(404, 'Vendor not found');

        const qr_type = data.qr_type === 'dynamic' ? 'dynamic' : 'static';
        if (data.amount !== undefined && data.amount !== null && Number(data.amount) <= 0) {
            throw new ApiError(400, 'amount must be greater than 0');
        }

        const qr_uuid = uuidv4();
        const qr_image = await renderQrImage(qr_uuid);

        return PaymentQrCode.create({
            vendor_id: vendor.id,
            qr_uuid,
            label: data.label || null,
            qr_type,
            amount: data.amount != null ? data.amount : null,
            coin: data.coin || 'BIGOD',
            qr_image,
            status: true,
            created_by: adminUserId || null
        });
    }

    async getById(id) {
        const qr = await PaymentQrCode.findByPk(id, {
            include: [{ model: VendorProfile, as: 'vendor', attributes: ['id', 'business_name', 'merchant_code'] }]
        });
        if (!qr) throw new ApiError(404, 'Payment QR not found');
        return qr;
    }

    async getList(page = 1, limit = 10, filters = {}) {
        const offset = (page - 1) * limit;
        const where = {};

        if (filters.vendor_id) where.vendor_id = filters.vendor_id;
        if (filters.qr_type) where.qr_type = filters.qr_type;
        if (typeof filters.status === 'boolean') where.status = filters.status;
        if (filters.search) where.label = { [db.Sequelize.Op.like]: `%${filters.search}%` };

        const { count, rows } = await PaymentQrCode.findAndCountAll({
            where,
            include: [{ model: VendorProfile, as: 'vendor', attributes: ['id', 'business_name', 'merchant_code'] }],
            limit,
            offset,
            order: [['created_at', 'DESC']]
        });

        return { total: count, page, totalPages: Math.ceil(count / limit), data: rows };
    }

    async toggleStatus(id, status) {
        const qr = await this.getById(id);
        return qr.update({ status: Boolean(status) });
    }
}

module.exports = new QrService();
