const User = require('../models/userModel');
const Assessment = require('../models/assessmentModel');
const Attempt = require('../models/attemptModel');

// @desc    Get dashboard stats
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAssessments = await Assessment.countDocuments();
    const totalAttempts = await Attempt.countDocuments();
    
    // Calculate passing rate
    const passedAttempts = await Attempt.countDocuments({ isPassed: true });
    const passRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;

    res.status(200).json({
      totalStudents,
      totalAssessments,
      totalAttempts,
      passRate
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};

module.exports = {
  getAnalytics
};
