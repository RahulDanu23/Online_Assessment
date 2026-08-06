const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const router = express.Router();

// Test Route: Only accessible by logged-in Admins
router.get('/dashboard', verifyToken, isAdmin, (req, res) => {
    res.status(200).json({ message: "Welcome to the Admin Dashboard!" });
});

module.exports = router;
