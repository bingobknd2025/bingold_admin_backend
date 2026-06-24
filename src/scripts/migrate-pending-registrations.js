// scripts/migrate-pending-registrations.js
//
// Idempotent runner for the bingopay_pending_registrations table (OTP-gated
// onboarding). Applies the same DDL as
// src/migrations/2026-06-24_pending_registrations.sql through the app's mysql2
// connection. Never uses sequelize.sync() — the live DB is a prod dump.
//
//   node src/scripts/migrate-pending-registrations.js
require('dotenv').config();
const { sequelize } = require('../config/database');

async function run() {
    await sequelize.authenticate();
    console.log('Connected. Applying pending-registrations migration...\n');

    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS \`bingopay_pending_registrations\` (
          \`id\`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
          \`email\`        VARCHAR(255) NOT NULL,
          \`account_type\` ENUM('customer','vendor') NOT NULL DEFAULT 'customer',
          \`first_name\`   VARCHAR(100) NULL,
          \`last_name\`    VARCHAR(100) NULL,
          \`phone\`        VARCHAR(50) NULL,
          \`country_id\`   VARCHAR(10) NULL,
          \`password_enc\` TEXT NOT NULL,
          \`otp_type\`     VARCHAR(50) NOT NULL DEFAULT 'SIGNUP',
          \`payload\`      JSON NULL,
          \`expires_at\`   DATETIME NULL,
          \`created_at\`   DATETIME NOT NULL,
          \`updated_at\`   DATETIME NOT NULL,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uniq_bingopay_pending_registrations_email\` (\`email\`),
          KEY \`idx_bingopay_pending_registrations_account_type\` (\`account_type\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('+ bingopay_pending_registrations table ensured');

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
