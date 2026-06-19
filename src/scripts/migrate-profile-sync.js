// scripts/migrate-profile-sync.js
//
// Adds the columns that cache a BinGold get_profile snapshot locally, so a
// viewed/edited user or vendor shows the same data as BinGold. Idempotent and
// additive only (never sync()), safe to run on the prod-dump server.
//
//   node src/scripts/migrate-profile-sync.js
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

async function addColumn(table, column, definition) {
    if (await columnExists(table, column)) {
        console.log(`= ${table}.${column} already exists`);
        return;
    }
    await sequelize.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
    console.log(`+ ${table}.${column} added`);
}

async function run() {
    await sequelize.authenticate();
    console.log('Connected. Applying profile-sync migration...\n');

    for (const table of ['bingopay_users', 'vendor_profiles']) {
        // coin -> wallet address map, pulled from the BinGold balances[] array.
        await addColumn(table, 'wallet_addresses', 'JSON NULL');
        // full last get_profile snapshot (so "whatever data comes in" is kept).
        await addColumn(table, 'bingold_profile', 'JSON NULL');
        // when the snapshot above was last refreshed from BinGold.
        await addColumn(table, 'profile_synced_at', 'DATETIME NULL');
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
