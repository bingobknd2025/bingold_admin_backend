// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ message: 'Authorization token missing' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
//     req.user = decoded;
//     next();
//   } catch {
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };


const jwt = require("jsonwebtoken");
const db = require("../models");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // const user = await db.PdaUser.findByPk(decoded.pda_user_id, decoded.name, {
    //   include: [{ model: db.Role, as: "user_role", attributes: ["id", "name", "slug"] }],
    //   attributes: ["id", "email", "is_active","role_id"],
    // });

    const user = await db.PdaUser.findOne({
  where: { id: decoded.pda_user_id },
  include: [{
    model: db.Role,
    as: "user_role",
    attributes: ["id", "name", "slug"]
  }]
});

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: "User is inactive" });
    }
// console.log(user.toJSON());    

    req.user = {
      pda_user_id: user.id,
      email: user.email,
      user_role: user.user_role,
      name: user.name
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
