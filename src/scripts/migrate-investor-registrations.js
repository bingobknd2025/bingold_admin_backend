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

    // Columns added after the table shipped. Each is added only when missing,
    // so this is safe to re-run.
    const addedColumns = {
        legal_company_name: 'VARCHAR(150) NULL',
        trading_name: 'VARCHAR(150) NULL',
        legal_entity_type: 'VARCHAR(100) NULL',
        country_of_incorporation: 'VARCHAR(100) NULL',
        registration_number: 'VARCHAR(50) NULL',
        tax_identification_number: 'VARCHAR(50) NULL',
        date_of_incorporation: 'DATE NULL',
        industry: 'VARCHAR(150) NULL',
        business_description: 'TEXT NULL',
        company_website: 'VARCHAR(200) NULL',

        // Signup consents. Both booleans default to 0, so rows captured before
        // the consent UI shipped read as "no consent on record" rather than as
        // a consent nobody gave.
        terms_accepted: 'TINYINT(1) NOT NULL DEFAULT 0',
        terms_accepted_at: 'DATETIME NULL',
        marketing_opt_in: 'TINYINT(1) NOT NULL DEFAULT 0',
        marketing_opt_in_at: 'DATETIME NULL',
        consent_version: 'VARCHAR(20) NULL'
    };

    const [existing] = await sequelize.query(`
        SELECT COLUMN_NAME FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'temporary_investor_registrations'
    `);
    const present = new Set(existing.map((row) => row.COLUMN_NAME));

    for (const [column, definition] of Object.entries(addedColumns)) {
        if (present.has(column)) continue;
        await sequelize.query(
            `ALTER TABLE \`temporary_investor_registrations\` ADD COLUMN \`${column}\` ${definition}`
        );
        console.log(`+ added column ${column}`);
    }

    // Marketing opt-in is a list filter, so keep it off a full scan.
    const [indexes] = await sequelize.query(`
        SELECT INDEX_NAME FROM information_schema.STATISTICS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'temporary_investor_registrations'
    `);
    const indexName = 'idx_temporary_investor_registrations_marketing_opt_in';

    if (!indexes.some((row) => row.INDEX_NAME === indexName)) {
        await sequelize.query(
            `ALTER TABLE \`temporary_investor_registrations\` ADD INDEX \`${indexName}\` (\`marketing_opt_in\`)`
        );
        console.log(`+ added index ${indexName}`);
    }

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
