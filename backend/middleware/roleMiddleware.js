const user = require('../models/userModel');
const { verifyToken } = require('./authMiddleware');

const isAdmin = (req, res, next) => {
  try {
    if(!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        message: "Access denied. Admin authorization required"
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

const isStudent = (req, res, next) => {
  try {
    if(!req.user || req.user.role !== 'student') {
      return res.status(403).json({
        message: "Access denied. Student authorization required"
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

module.exports = {isAdmin, isStudent};