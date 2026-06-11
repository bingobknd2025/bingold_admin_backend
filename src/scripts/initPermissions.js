// scripts/initPermissions.js
const db = require('../models');

const initPermissionSystem = async () => {
    try {
        console.log('Syncing BingoPay database tables...');

        // We deliberately sync ONLY the new BingoPay models here, in FK-dependency
        // order. The core tables (pda_users, otps, ...) are managed by the imported
        // production dump and have schema drift vs the model definitions; running a
        // global sync({ alter: true }) against them fails (malformed self-FKs on
        // pda_users, missing index columns on otps, etc.). Scoping the sync to the
        // brand-new tables creates them cleanly and never touches existing tables.
        const bingopayModels = [
            db.BingopayUser,
            db.VendorProfile,
            db.PaymentQrCode,
            db.PaymentTransaction,
            db.MerchantSettlement,
            db.KycApplication,
            db.SsoSyncLog,
            db.VendorKycDocument
        ];
        for (const model of bingopayModels) {
            await model.sync();
            console.log(`  ✓ ${model.getTableName()}`);
        }
        console.log('BingoPay tables synced successfully!');

        // Add the new pda_roles.scope column explicitly (idempotent).
        const queryInterface = db.sequelize.getQueryInterface();
        const roleColumns = await queryInterface.describeTable('pda_roles');
        if (!roleColumns.scope) {
            await queryInterface.addColumn('pda_roles', 'scope', {
                type: db.Sequelize.ENUM('admin', 'bingopay'),
                allowNull: false,
                defaultValue: 'admin'
            });
            console.log("Added 'scope' column to pda_roles.");
        }

        // Idempotent column additions for BingoPay tables (plain model.sync()
        // creates tables but never alters existing ones).
        const addColumnIfMissing = async (table, column, definition) => {
            const cols = await queryInterface.describeTable(table);
            if (!cols[column]) {
                await queryInterface.addColumn(table, column, definition);
                console.log(`Added '${column}' column to ${table}.`);
            }
        };

        await addColumnIfMissing('vendor_profiles', 'settle_coin', {
            type: db.Sequelize.STRING(20), allowNull: false, defaultValue: 'BIGOD'
        });
        await addColumnIfMissing('vendor_profiles', 'accepted_coins', {
            type: db.Sequelize.JSON, allowNull: true
        });
        await addColumnIfMissing('vendor_profiles', 'kyc_mode', {
            type: db.Sequelize.ENUM('online', 'offline'), allowNull: true
        });
        await addColumnIfMissing('payment_transactions', 'pay_coin', {
            type: db.Sequelize.STRING(20), allowNull: true
        });
        await addColumnIfMissing('payment_transactions', 'pay_amount', {
            type: db.Sequelize.DECIMAL(30, 8), allowNull: true
        });
        await addColumnIfMissing('payment_transactions', 'conversion_rate', {
            type: db.Sequelize.DECIMAL(30, 12), allowNull: true
        });

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

            // ─── BingoPay ───────────────────────────────────────────────

            // BingoPay Users
            { name: 'View BingoPay Users', slug: 'bingopay_user.list', module: 'BingoPay User' },
            { name: 'View Single BingoPay User', slug: 'bingopay_user.view', module: 'BingoPay User' },
            { name: 'Change BingoPay User Status', slug: 'bingopay_user.change-status', module: 'BingoPay User' },

            // Vendors
            { name: 'View Vendors', slug: 'vendor.list', module: 'Vendor' },
            { name: 'View Single Vendor', slug: 'vendor.view', module: 'Vendor' },
            { name: 'Create Vendor', slug: 'vendor.create', module: 'Vendor' },
            { name: 'Update Vendor', slug: 'vendor.update', module: 'Vendor' },
            { name: 'Approve Vendor', slug: 'vendor.approve', module: 'Vendor' },
            { name: 'Reject Vendor', slug: 'vendor.reject', module: 'Vendor' },
            { name: 'Change Vendor Status', slug: 'vendor.change-status', module: 'Vendor' },
            { name: 'Initiate Vendor KYC', slug: 'vendor.kyc', module: 'Vendor' },

            // Payment QR
            { name: 'View Payment QR Codes', slug: 'payment_qr.list', module: 'Payment QR' },
            { name: 'View Single Payment QR', slug: 'payment_qr.view', module: 'Payment QR' },
            { name: 'Create Payment QR', slug: 'payment_qr.create', module: 'Payment QR' },
            { name: 'Change Payment QR Status', slug: 'payment_qr.change-status', module: 'Payment QR' },

            // Payments
            { name: 'View Payments', slug: 'payment.list', module: 'Payment' },
            { name: 'View Single Payment', slug: 'payment.view', module: 'Payment' },

            // Settlements
            { name: 'View Settlements', slug: 'settlement.list', module: 'Settlement' },
            { name: 'View Single Settlement', slug: 'settlement.view', module: 'Settlement' },
            { name: 'Create Settlement', slug: 'settlement.create', module: 'Settlement' },
            { name: 'Manage Settlement', slug: 'settlement.manage', module: 'Settlement' },
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

        // ─── BingoPay back-office roles ──────────────────────────────────
        // Admin-scope roles that operate the BingoPay ecosystem. Customer /
        // vendor / cashier (scope='bingopay') roles are created by the BingoPay
        // onboarding flow, not seeded here.
        const permissionBySlug = {};
        allPermissions.forEach((p) => { permissionBySlug[p.slug] = p.id; });

        const assignSlugsToRole = async (roleId, slugs) => {
            const rows = slugs
                .filter((slug) => permissionBySlug[slug])
                .map((slug) => ({ role_id: roleId, permission_id: permissionBySlug[slug] }));
            if (rows.length) await db.RolePermission.bulkCreate(rows, { ignoreDuplicates: true });
        };

        const bingopayRoles = [
            {
                name: 'Finance Admin',
                slug: 'finance_admin',
                description: 'Oversees BingoPay payments and settlements',
                scope: 'admin',
                permissions: [
                    'dashboard.view', 'profile.view', 'profile.update',
                    'payment.list', 'payment.view',
                    'settlement.list', 'settlement.view', 'settlement.create', 'settlement.manage',
                    'vendor.list', 'vendor.view'
                ]
            },
            {
                name: 'Vendor Manager',
                slug: 'vendor_manager',
                description: 'Onboards, approves and manages BingoPay vendors',
                scope: 'admin',
                permissions: [
                    'dashboard.view', 'profile.view', 'profile.update',
                    'bingopay_user.list', 'bingopay_user.view', 'bingopay_user.change-status',
                    'vendor.list', 'vendor.view', 'vendor.create', 'vendor.update',
                    'vendor.approve', 'vendor.reject', 'vendor.change-status', 'vendor.kyc',
                    'payment_qr.list', 'payment_qr.view', 'payment_qr.create', 'payment_qr.change-status',
                    'payment.list', 'payment.view'
                ]
            }
        ];

        for (const roleData of bingopayRoles) {
            const [role] = await db.Role.findOrCreate({
                where: { slug: roleData.slug },
                defaults: {
                    name: roleData.name,
                    slug: roleData.slug,
                    description: roleData.description,
                    scope: roleData.scope,
                    is_default: false
                }
            });
            await assignSlugsToRole(role.id, roleData.permissions);
            console.log(`  - ${roleData.name} (${roleData.slug}) configured`);
        }

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