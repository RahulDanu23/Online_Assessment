const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { isStudent } = require('../middleware/roleMiddleware');
const { getPublishedAssessments, getAssessmentForStudent } = require('../controllers/assessmentController');
const { getCategories } = require('../controllers/categoryController');
const { submitAttempt, getStudentAttempts, getAttemptDetails } = require('../controllers/attemptController');
const { getLeaderboard } = require('../controllers/leaderboardController');

const router = express.Router();

// Profile Route: Only accessible by logged-in Students
router.get('/profile', verifyToken, isStudent, (req, res) => {
    res.status(200).json({ message: "Welcome to the Student Profile!" });
});

// Category Routes (Read-only for students)
router.get('/categories', verifyToken, isStudent, getCategories);

// Assessment Routes
router.get('/assessments', verifyToken, isStudent, getPublishedAssessments);
router.get('/assessments/:id', verifyToken, isStudent, getAssessmentForStudent);

// Attempt Routes
router.post('/attempts', verifyToken, isStudent, submitAttempt);
router.get('/attempts', verifyToken, isStudent, getStudentAttempts);
router.get('/attempts/:id', verifyToken, isStudent, getAttemptDetails);

// Leaderboard Route
router.get('/leaderboard', verifyToken, getLeaderboard);

module.exports = router;


