// routes/admin.routes.js
const router = require("express").Router();

// Import all RBAC related admin routes
router.use("/permissions", require("../admin/permission.routes"));
router.use("/roles", require("../admin/role.routes"));
router.use("/users", require("../admin/user.routes"));
router.use("/blogs", require("../admin/blog.routes"));
router.use("/news", require("../admin/news.routes"));
router.use("/common", require("../admin/common.routes"));

router.post("/dashboard", async (req, res, next) => {
    try {
        const {
            PdaUser,
            Role,
            Permission,
            News,
            Blog
        } = require('../../models');

        const [
            totalUsers,
            totalRoles,
            totalPermissions,
            activeUsers,
            totalBlogs,
            totalNews
        ] = await Promise.all([
            PdaUser.count(),
            Role.count(),
            Permission.count(),
            PdaUser.count({ where: { is_active: true } }),
            News.count(),
            Blog.count()
        ]);

        res.json({
            success: true,
            message: 'Dashboard data fetched successfully',
            data: {
                // User management stats
                userManagement: {
                    totalUsers,
                    totalRoles,
                    totalPermissions,
                    activeUsers,
                    inactiveUsers: totalUsers - activeUsers
                },
                contentManagement: {
                    totalBlogs,
                    totalNews
                }
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;