module.exports = (...roles) => {
  return (req, res, next) => {
    console.log("Roles required:", roles);
    console.log("User roles:", req.user?.user_role?.slug || req.user?.role_slug);
    
    const userRole = req.user?.user_role?.slug || req.user?.role_slug;
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden: Role not allowed' });
    }

    next();
  };
};
