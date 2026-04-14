// scripts/migrateUserRoles.js
const db = require('../models');

const migrateUserRoles = async () => {
    try {
        console.log('Starting user role migration...');

        // Get all existing users
        const users = await db.PdaUser.findAll({
            attributes: ['id', 'role_id']
        });

        console.log(`Found ${users.length} users to migrate`);

        // Find transport personnel role
        const transportRole = await db.Role.findOne({
            where: { slug: 'transport_personnel' }
        });

        if (!transportRole) {
            console.error('Transport personnel role not found!');
            return;
        }

        // Update users who don't have role_id
        const usersToUpdate = users.filter(user => !user.role_id);

        console.log(`Migrating ${usersToUpdate.length} users...`);

        for (const user of usersToUpdate) {
            await db.PdaUser.update(
                { role_id: transportRole.id },
                { where: { id: user.id } }
            );
        }

        console.log('Migration completed successfully!');

    } catch (error) {
        console.error('Migration error:', error);
    }
};

// Run migration
if (require.main === module) {
    migrateUserRoles();
}

module.exports = migrateUserRoles;