const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { isStudent } = require('../middleware/roleMiddleware');
const router = express.Router();

// Test Route: Only accessible by logged-in Students
router.get('/profile', verifyToken, isStudent, (req, res) => {
    res.status(200).json({ message: "Welcome to the Student Profile!" });
});

module.exports = router;
