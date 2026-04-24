// scripts/initPermissions.js
const db = require('../models');

const initPermissionSystem = async () => {
    try {
        console.log('Syncing permission database tables...');

        // Sync all models
        await db.sequelize.sync({ alter: true });
        console.log('Database tables synced successfully!');

        // Create default permissions
        console.log('Creating default permissions...');
        const defaultPermissions = [
            // Permission Module
            { name: 'View Permissions', slug: 'permission.view', module: 'Permission' },
            { name: 'Create Permission', slug: 'permission.create', module: 'Permission' },
            { name: 'Update Permission', slug: 'permission.update', module: 'Permission' },
            { name: 'Delete Permission', slug: 'permission.delete', module: 'Permission' },

            // Role Module
            { name: 'View Roles', slug: 'role.view', module: 'Role' },
            { name: 'Create Role', slug: 'role.create', module: 'Role' },
            { name: 'Update Role', slug: 'role.update', module: 'Role' },
            { name: 'Delete Role', slug: 'role.delete', module: 'Role' },
            { name: 'Assign Permissions to Role', slug: 'role.assign-permissions', module: 'Role' },

            // User Module
            { name: 'View Users', slug: 'user.view', module: 'User' },
            { name: 'Create User', slug: 'user.create', module: 'User' },
            { name: 'Update User', slug: 'user.update', module: 'User' },
            { name: 'Delete User', slug: 'user.delete', module: 'User' },
            { name: 'Change User Status', slug: 'user.change-status', module: 'User' },



            // Dashboard
            { name: 'View Dashboard', slug: 'dashboard.view', module: 'Dashboard' },

            // Profile
            { name: 'View Profile', slug: 'profile.view', module: 'Profile' },
            { name: 'Update Profile', slug: 'profile.update', module: 'Profile' },

            // Blog Module
            { name: 'View Blogs', slug: 'blog.list', module: 'Blog' },
            { name: 'View Single Blog', slug: 'blog.view', module: 'Blog' },
            { name: 'Create Blog', slug: 'blog.create', module: 'Blog' },
            { name: 'Update Blog', slug: 'blog.update', module: 'Blog' },
            { name: 'Delete Blog', slug: 'blog.delete', module: 'Blog' },

            // Youtube Video Module
            { name: 'View Youtube Videos', slug: 'youtube_video.list', module: 'YoutubeVideo' },
            { name: 'View Single Youtube Video', slug: 'youtube_video.view', module: 'YoutubeVideo' },
            { name: 'Create Youtube Video', slug: 'youtube_video.create', module: 'YoutubeVideo' },
            { name: 'Update Youtube Video', slug: 'youtube_video.update', module: 'YoutubeVideo' },
            { name: 'Delete Youtube Video', slug: 'youtube_video.delete', module: 'YoutubeVideo' },

            // Agent Module
            { name: 'View Agents', slug: 'agent.list', module: 'Agent' },
            { name: 'View Single Agent', slug: 'agent.view', module: 'Agent' },
            { name: 'Create Agent', slug: 'agent.create', module: 'Agent' },
            { name: 'Update Agent', slug: 'agent.update', module: 'Agent' },
            { name: 'Delete Agent', slug: 'agent.delete', module: 'Agent' },
        ];

        for (const permData of defaultPermissions) {
            await db.Permission.findOrCreate({
                where: { slug: permData.slug },
                defaults: permData
            });
        }

        console.log('Default permissions created!');

        // Create default roles
        console.log('Creating default roles...');

        // Super Admin Role
        const [adminRole] = await db.Role.findOrCreate({
            where: { slug: 'super_admin' },
            defaults: {
                name: 'Super Admin',
                slug: 'super_admin',
                description: 'Has all system permissions',
                is_default: false
            }
        });



        // Assign all permissions to super admin
        console.log('Assigning permissions to super admin...');
        const allPermissions = await db.Permission.findAll();
        const adminPermissions = allPermissions.map(perm => ({
            role_id: adminRole.id,
            permission_id: perm.id
        }));

        await db.RolePermission.bulkCreate(adminPermissions, {
            ignoreDuplicates: true
        });



        console.log('Permissions assigned to roles!');

        // Create default admin user (if not exists)
        const adminEmail = 'work.adityasahgal@gmail.com';
        const adminExists = await db.PdaUser.findOne({ where: { email: adminEmail } });

        if (!adminExists) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('Admin@321', 10);

            await db.PdaUser.create({
                name: 'System Administrator',
                email: adminEmail,
                password: hashedPassword,
                role_id: adminRole.id,
                role: 'SUPER_ADMIN',
                otp_enabled: false,
                is_active: true
            });

            console.log('Default admin user created!');
            console.log('Email: work.adityasahgal@gmail.com');
            console.log('Password: Admin@321');
        } else {
            console.log('Admin user already exists');
        }

        console.log('\n✅ Permission system initialization complete!');
        console.log('Roles created:');
        console.log(`  - ${adminRole.name} (${adminRole.slug})`);
        console.log(`\nTotal Permissions: ${allPermissions.length}`);

    } catch (error) {
        console.error('Error initializing permission system:', error);
        process.exit(1);
    }
};

// Run if called directly
if (require.main === module) {
    initPermissionSystem();
}

module.exports = initPermissionSystem;