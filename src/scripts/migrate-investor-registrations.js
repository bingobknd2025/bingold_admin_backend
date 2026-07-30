// scripts/migrate-investor-registrations.js
//
// Idempotent runner for the temporary_investor_registrations table (investor-ui
// ICO signup capture). Applies the same DDL as
// src/migrations/2026-07-30_temporary_investor_registrations.sql through the
// app's mysql2 connection. Never uses sequelize.sync() — the live DB is a prod
// dump and a global sync({alter:true}) fails against it.
//
//   node src/scripts/migrate-investor-registrations.js
require('dotenv').config();
const { sequelize } = require('../config/database');

async function run() {
    await sequelize.authenticate();
    console.log('Connected. Applying investor-registrations migration...\n');

    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS \`temporary_investor_registrations\` (
          \`id\`                     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
          \`email\`                  VARCHAR(255) NOT NULL,
          \`account_type\`           ENUM('individual','company') NOT NULL DEFAULT 'individual',
          \`first_name\`             VARCHAR(100) NULL,
          \`last_name\`              VARCHAR(100) NULL,
          \`phone\`                  VARCHAR(50) NULL,
          \`country\`                VARCHAR(100) NULL,
          \`ref_code\`               VARCHAR(100) NULL,
          \`status\`                 ENUM('PENDING_OTP','PENDING_DOCUMENTS','DOCS_SUBMITTED','COMPLETED')
                                       NOT NULL DEFAULT 'PENDING_OTP',
          \`documents\`              JSON NULL,
          \`documents_submitted_at\` DATETIME NULL,
          \`source\`                 VARCHAR(50) NOT NULL DEFAULT 'investor-ui',
          \`meta\`                   JSON NULL,
          \`created_at\`             DATETIME NOT NULL,
          \`updated_at\`             DATETIME NOT NULL,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uniq_temporary_investor_registrations_email\` (\`email\`),
          KEY \`idx_temporary_investor_registrations_account_type\` (\`account_type\`),
          KEY \`idx_temporary_investor_registrations_status\` (\`status\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('+ temporary_investor_registrations table ensured');

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
