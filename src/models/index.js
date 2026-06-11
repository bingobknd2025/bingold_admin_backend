const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/database");

const sequelize = config.sequelize;

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import core RBAC models
db.PdaUser = require("./pda_user.model")(sequelize, DataTypes);
db.PdaUserToken = require("./pda_user_token.model")(sequelize, DataTypes);
db.Permission = require("./permission.model")(sequelize, DataTypes);
db.Role = require("./role.model")(sequelize, DataTypes);
db.RolePermission = require("./role_permission.model")(sequelize, DataTypes);
db.Otp = require("./otp.model")(sequelize, DataTypes);
db.Blog = require("./blog.model")(sequelize, DataTypes);
db.News = require("./news.model")(sequelize, DataTypes);
db.YoutubeVideo = require("./youtube_video.model")(sequelize, DataTypes);
db.Agent = require("./agent.model")(sequelize, DataTypes);
db.AgentScanLog = require("./agent_scan_log.model")(sequelize, DataTypes);

// BingoPay domain models (payment orchestration layer on top of BinGold).
// BinGold remains the system of record for identity, wallet, balance, ledger
// and settlement — these tables only hold BingoPay-specific orchestration data.
db.BingopayUser = require("./bingopay_user.model")(sequelize, DataTypes);
db.VendorProfile = require("./vendor_profile.model")(sequelize, DataTypes);
db.PaymentQrCode = require("./payment_qr_code.model")(sequelize, DataTypes);
db.PaymentTransaction = require("./payment_transaction.model")(sequelize, DataTypes);
db.MerchantSettlement = require("./merchant_settlement.model")(sequelize, DataTypes);
db.KycApplication = require("./kyc_application.model")(sequelize, DataTypes);
db.SsoSyncLog = require("./sso_sync_log.model")(sequelize, DataTypes);
db.VendorKycDocument = require("./vendor_kyc_document.model")(sequelize, DataTypes);

// Define associations

// 1. User Relationships
db.PdaUser.hasMany(db.PdaUserToken, {
  foreignKey: "pda_user_id",
  as: "tokens"
});

db.PdaUserToken.belongsTo(db.PdaUser, {
  foreignKey: "pda_user_id",
  as: "user"
});

// 2. User-Role Relationship
db.PdaUser.belongsTo(db.Role, {
  foreignKey: "role_id",
  as: "user_role"
});

db.Role.hasMany(db.PdaUser, {
  foreignKey: "role_id",
  as: "users"
});

db.PdaUser.belongsTo(db.PdaUser, {
  foreignKey: 'created_by',
  as: 'creator'
});

db.PdaUser.belongsTo(db.PdaUser, {
  foreignKey: 'updated_by',
  as: 'updater'
});

// 3. Role-Permission Many-to-Many Relationship
db.Role.belongsToMany(db.Permission, {
  through: db.RolePermission,
  foreignKey: "role_id",
  otherKey: "permission_id",
  as: "permissions"
});

db.Permission.belongsToMany(db.Role, {
  through: db.RolePermission,
  foreignKey: "permission_id",
  otherKey: "role_id",
  as: "roles"
});

// 4. RolePermission relationships
db.RolePermission.belongsTo(db.Role, {
  foreignKey: "role_id",
  as: "role_detail"
});

db.RolePermission.belongsTo(db.Permission, {
  foreignKey: "permission_id",
  as: "permission_detail"
});

db.Role.hasMany(db.RolePermission, {
  foreignKey: "role_id",
  as: "role_permissions"
});

db.Permission.hasMany(db.RolePermission, {
  foreignKey: "permission_id",
  as: "permission_roles"
});

// 5. Blog and News mappings
db.Blog.belongsTo(db.PdaUser, { foreignKey: 'user_id', as: 'author' });
db.PdaUser.hasMany(db.Blog, { foreignKey: 'user_id', as: 'blogs' });

db.News.belongsTo(db.PdaUser, { foreignKey: 'user_id', as: 'author' });
db.PdaUser.hasMany(db.News, { foreignKey: 'user_id', as: 'news' });

// 6. Youtube Video mappings
db.YoutubeVideo.belongsTo(db.PdaUser, { foreignKey: 'created_by', as: 'creator' });
db.YoutubeVideo.belongsTo(db.PdaUser, { foreignKey: 'updated_by', as: 'updater' });
db.PdaUser.hasMany(db.YoutubeVideo, { foreignKey: 'created_by', as: 'youtube_videos' });

// 7. Agent + scan logs
db.Agent.belongsTo(db.PdaUser, { foreignKey: 'created_by', as: 'creator' });
db.Agent.belongsTo(db.PdaUser, { foreignKey: 'updated_by', as: 'updater' });
db.Agent.hasMany(db.AgentScanLog, { foreignKey: 'agent_id', as: 'scan_logs', onDelete: 'CASCADE' });
db.AgentScanLog.belongsTo(db.Agent, { foreignKey: 'agent_id', as: 'agent' });

// 8. BingoPay domain associations

// BingoPay user <-> vendor profile (1:1)
db.BingopayUser.hasOne(db.VendorProfile, { foreignKey: 'user_id', as: 'vendor_profile' });
db.VendorProfile.belongsTo(db.BingopayUser, { foreignKey: 'user_id', as: 'user' });

// Admin who approved a vendor
db.VendorProfile.belongsTo(db.PdaUser, { foreignKey: 'approved_by', as: 'approver' });

// Vendor <-> payment QR codes
db.VendorProfile.hasMany(db.PaymentQrCode, { foreignKey: 'vendor_id', as: 'qr_codes', onDelete: 'CASCADE' });
db.PaymentQrCode.belongsTo(db.VendorProfile, { foreignKey: 'vendor_id', as: 'vendor' });
db.PaymentQrCode.belongsTo(db.PdaUser, { foreignKey: 'created_by', as: 'creator' });

// Vendor <-> payment transactions
db.VendorProfile.hasMany(db.PaymentTransaction, { foreignKey: 'receiver_vendor_id', as: 'transactions' });
db.PaymentTransaction.belongsTo(db.VendorProfile, { foreignKey: 'receiver_vendor_id', as: 'vendor' });
db.PaymentTransaction.belongsTo(db.PaymentQrCode, { foreignKey: 'qr_id', as: 'qr' });
db.PaymentTransaction.belongsTo(db.BingopayUser, { foreignKey: 'sender_user_id', as: 'sender' });

// Vendor <-> settlements
db.VendorProfile.hasMany(db.MerchantSettlement, { foreignKey: 'vendor_id', as: 'settlements' });
db.MerchantSettlement.belongsTo(db.VendorProfile, { foreignKey: 'vendor_id', as: 'vendor' });
db.MerchantSettlement.belongsTo(db.PdaUser, { foreignKey: 'processed_by', as: 'processor' });

// KYC applications
db.BingopayUser.hasMany(db.KycApplication, { foreignKey: 'user_id', as: 'kyc_applications' });
db.KycApplication.belongsTo(db.BingopayUser, { foreignKey: 'user_id', as: 'user' });
db.VendorProfile.hasMany(db.KycApplication, { foreignKey: 'vendor_id', as: 'kyc_applications' });
db.KycApplication.belongsTo(db.VendorProfile, { foreignKey: 'vendor_id', as: 'vendor' });

// Offline KYC documents
db.VendorProfile.hasMany(db.VendorKycDocument, { foreignKey: 'vendor_id', as: 'kyc_documents', onDelete: 'CASCADE' });
db.VendorKycDocument.belongsTo(db.VendorProfile, { foreignKey: 'vendor_id', as: 'vendor' });
db.VendorKycDocument.belongsTo(db.PdaUser, { foreignKey: 'uploaded_by_admin', as: 'uploader' });

module.exports = db;