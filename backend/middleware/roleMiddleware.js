const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403); // استخدمنا 403 لأن المستخدم مسجل دخول لكن ليس لديه صلاحية
    throw new Error('Not authorized as an admin');
  }
};

// ميدل وير للمستخدم العادي (يمكنك استخدامه لو أردت التأكد أنه ليس أدمن مثلاً)
const userOnly = (req, res, next) => {
  if (req.user && !req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('Access denied, users only');
  }
};

module.exports = { admin, userOnly };