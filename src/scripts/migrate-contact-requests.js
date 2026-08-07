// scripts/migrate-contact-requests.js
//
// Idempotent runner for the contact_requests table (public "contact us" form).
// Applies the same DDL as src/migrations/2026-08-07_contact_requests.sql through
// the app's mysql2 connection. Never uses sequelize.sync() — the live DB is a
// prod dump and a global sync({ alter: true }) fails against it.
//
//   node src/scripts/migrate-contact-requests.js
require('dotenv').config();
const { sequelize } = require('../config/database');

async function run() {
    await sequelize.authenticate();
    console.log('Connected. Applying contact-requests migration...\n');

    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS \`contact_requests\` (
          \`id\`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
          \`ticket_ref\`  VARCHAR(30)  NOT NULL,
          \`name\`        VARCHAR(150) NOT NULL,
          \`email\`       VARCHAR(255) NOT NULL,
          \`subject\`     VARCHAR(255) NOT NULL,
          \`message\`     TEXT         NOT NULL,
          \`status\`      ENUM('NEW','IN_PROGRESS','RESOLVED','CLOSED') NOT NULL DEFAULT 'NEW',
          \`admin_note\`  TEXT         NULL,
          \`source\`      VARCHAR(50)  NOT NULL DEFAULT 'website',
          \`ip_address\`  VARCHAR(45)  NULL,
          \`user_agent\`  VARCHAR(255) NULL,
          \`resolved_at\` DATETIME     NULL,
          \`resolved_by\` INT          NULL,
          \`created_at\`  DATETIME     NOT NULL,
          \`updated_at\`  DATETIME     NOT NULL,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uniq_contact_requests_ticket_ref\` (\`ticket_ref\`),
          KEY \`idx_contact_requests_status\` (\`status\`),
          KEY \`idx_contact_requests_email\` (\`email\`),
          KEY \`idx_contact_requests_created_at\` (\`created_at\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('+ contact_requests table ensured');

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
