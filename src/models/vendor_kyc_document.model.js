// models/vendor_kyc_document.model.js
//
// Offline (manual) KYC documents for a vendor. Used when KYC is collected and
// reviewed by hand instead of through Sumsub. Each row is one uploaded file of a
// known type; an admin reviews each (or the vendor overall) and then approves
// the vendor via the normal vendor approve/reject flow.
module.exports = (sequelize, DataTypes) => {
    const VendorKycDocument = sequelize.define('VendorKycDocument', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        vendor_id: {
            // -> vendor_profiles.id
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },
        document_type: {
            type: DataTypes.ENUM(
                'certificate_of_incorporation',
                'gst_certificate',
                'pan_card',
                'director_id',
                'address_proof',
                'bank_statement',
                'selfie',
                'other'
            ),
            allowNull: false
        },
        file_url: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        file_name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        mime_type: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            allowNull: false,
            defaultValue: 'pending'
        },
        review_note: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        // Admin who uploaded on the vendor's behalf. NULL = vendor self-uploaded.
        uploaded_by_admin: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
            references: { model: 'pda_users', key: 'id' }
        }
    }, {
        tableName: 'vendor_kyc_documents',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { fields: ['vendor_id'] },
            { fields: ['document_type'] },
            { fields: ['status'] }
        ]
    });

    return VendorKycDocument;
};
