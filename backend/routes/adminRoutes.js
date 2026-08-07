const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const { 
  createAssessment, 
  getAdminAssessments, 
  getAssessmentById, 
  updateAssessment, 
  deleteAssessment, 
  togglePublishStatus 
} = require('../controllers/assessmentController');
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories
} = require('../controllers/categoryController');
const { getAllAttempts } = require('../controllers/attemptController');
const { getAnalytics } = require('../controllers/analyticsController');

const router = express.Router();

// Dashboard Route: Only accessible by logged-in Admins
router.get('/dashboard', verifyToken, isAdmin, (req, res) => {
    res.status(200).json({ message: "Welcome to the Admin Dashboard!" });
});

// Analytics Route
router.get('/analytics', verifyToken, isAdmin, getAnalytics);


// Category Routes
router.post('/categories', verifyToken, isAdmin, createCategory);
router.get('/categories', verifyToken, isAdmin, getCategories);
router.put('/categories/:id', verifyToken, isAdmin, updateCategory);
router.delete('/categories/:id', verifyToken, isAdmin, deleteCategory);

// Assessment Routes
router.post('/assessments', verifyToken, isAdmin, createAssessment);
router.get('/assessments', verifyToken, isAdmin, getAdminAssessments);
router.get('/assessments/:id', verifyToken, isAdmin, getAssessmentById);
router.put('/assessments/:id', verifyToken, isAdmin, updateAssessment);
router.delete('/assessments/:id', verifyToken, isAdmin, deleteAssessment);
router.patch('/assessments/:id/publish', verifyToken, isAdmin, togglePublishStatus);

// Attempts Routes
router.get('/attempts', verifyToken, isAdmin, getAllAttempts);

module.exports = router;


