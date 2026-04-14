module.exports = {
  accessSecret: process.env.JWT_ACCESS_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  accessTTL: 900,          // 15 min
  refreshTTL: 1209600      // 14 days
};
