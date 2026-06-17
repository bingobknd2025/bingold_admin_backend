// scripts/migrate-vendor-sso.js
//
// Idempotent runner for the Vendor SSO schema changes. Applies the same DDL as
// src/migrations/2026-06-15_vendor_sso.sql, but through the app's mysql2
// connection (the mysql CLI can't load mysql_native_password locally).
//
//   node src/scripts/migrate-vendor-sso.js
//
// Never uses sequelize.sync() — the live DB is a prod dump. Each step checks
// information_schema first, so re-running is a safe no-op.
require('dotenv').config();
const { sequelize } = require('../config/database');

async function columnExists(table, column) {
    const [rows] = await sequelize.query(
        `SELECT 1 FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ? LIMIT 1`,
        { replacements: [table, column] }
    );
    return rows.length > 0;
}

async function indexExists(table, index) {
    const [rows] = await sequelize.query(
        `SELECT 1 FROM information_schema.STATISTICS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ? LIMIT 1`,
        { replacements: [table, index] }
    );
    return rows.length > 0;
}

async function addColumn(table, column, definition) {
    if (await columnExists(table, column)) {
        console.log(`= ${table}.${column} already exists`);
        return;
    }
    await sequelize.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
    console.log(`+ ${table}.${column} added`);
}

async function addUniqueIndex(table, index, column) {
    if (await indexExists(table, index)) {
        console.log(`= index ${index} already exists`);
        return;
    }
    await sequelize.query(`ALTER TABLE \`${table}\` ADD UNIQUE INDEX \`${index}\` (\`${column}\`)`);
    console.log(`+ index ${index} added`);
}

async function run() {
    await sequelize.authenticate();
    console.log('Connected. Applying Vendor SSO migration...\n');

    // vendor_profiles
    await addColumn('vendor_profiles', 'uuid', 'CHAR(36) NULL AFTER `id`');
    await addColumn('vendor_profiles', 'shop_name', 'VARCHAR(255) NULL AFTER `business_name`');
    await addColumn('vendor_profiles', 'shop_slug', 'VARCHAR(255) NULL AFTER `shop_name`');
    await addColumn('vendor_profiles', 'support_email', 'VARCHAR(255) NULL AFTER `website`');
    await addColumn('vendor_profiles', 'support_phone', 'VARCHAR(50) NULL AFTER `support_email`');
    await addColumn('vendor_profiles', 'description', 'TEXT NULL AFTER `support_phone`');
    await addColumn('vendor_profiles', 'kyc_decision', 'JSON NULL AFTER `rejection_reason`');

    // Backfill a uuid for any existing rows, then enforce uniqueness.
    const [res] = await sequelize.query('UPDATE `vendor_profiles` SET `uuid` = (SELECT UUID()) WHERE `uuid` IS NULL');
    console.log(`~ backfilled uuid on existing vendor_profiles rows`);
    await addUniqueIndex('vendor_profiles', 'uniq_vendor_profiles_uuid', 'uuid');
    await addUniqueIndex('vendor_profiles', 'uniq_vendor_profiles_shop_slug', 'shop_slug');

    // bingopay_users
    await addColumn('bingopay_users', 'password_hash', 'VARCHAR(255) NULL AFTER `phone`');
    // Shared identity UUID issued by BinGold (same value as vendor_profiles.uuid).
    await addColumn('bingopay_users', 'uuid', 'CHAR(36) NULL AFTER `id`');
    await addUniqueIndex('bingopay_users', 'uniq_bingopay_users_uuid', 'uuid');

    // vendor_kyc_documents
    await addColumn('vendor_kyc_documents', 'public_id', 'VARCHAR(255) NULL AFTER `file_url`');

    // vendor_sso_tokens table
    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS \`vendor_sso_tokens\` (
          \`id\`                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
          \`vendor_id\`            BIGINT UNSIGNED NOT NULL,
          \`token\`                VARCHAR(128) NOT NULL,
          \`status\`               ENUM('pending','used','expired') NOT NULL DEFAULT 'pending',
          \`redirect_url\`         VARCHAR(500) NULL,
          \`scanned_by_user_uuid\` VARCHAR(36) NULL,
          \`expires_at\`           DATETIME NOT NULL,
          \`used_at\`              DATETIME NULL,
          \`created_at\`           DATETIME NOT NULL,
          \`updated_at\`           DATETIME NOT NULL,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uniq_vendor_sso_tokens_token\` (\`token\`),
          KEY \`idx_vendor_sso_tokens_vendor\` (\`vendor_id\`),
          KEY \`idx_vendor_sso_tokens_status\` (\`status\`),
          CONSTRAINT \`fk_vendor_sso_tokens_vendor\`
            FOREIGN KEY (\`vendor_id\`) REFERENCES \`vendor_profiles\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('+ vendor_sso_tokens table ensured');

    console.log('\nMigration complete.');
}

run()
    .then(() => sequelize.close())
    .then(() => process.exit(0))
    .catch(async (err) => {
        console.error('\nMigration failed:', err.message);
        try { await sequelize.close(); } catch (_) {}
        process.exit(1);
    });
