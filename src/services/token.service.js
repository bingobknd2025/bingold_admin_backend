const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.accessToken = (user) => {
  return jwt.sign(
    {
      pda_user_id: user.pda_user_id,
      role_id: user.role_id, // Add role_id to token
      email: user.email,
      permissions: user.permissions || []
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  );
};

exports.refreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

exports.hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};


