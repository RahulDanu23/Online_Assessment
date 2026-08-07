const Attempt = require('../models/attemptModel');
const User = require('../models/userModel');

const getLeaderboard = async (req, res) => {
  try {
    const attempts = await Attempt.find().populate('student', 'name');
    
    const userStats = {};
    attempts.forEach(att => {
        if (!att.student) return;
        const sId = att.student._id.toString();
        if (!userStats[sId]) {
            userStats[sId] = { name: att.student.name, totalScore: 0, attempts: 0 };
        }
        userStats[sId].totalScore += att.score;
        userStats[sId].attempts += 1;
    });

    const leaderboard = Object.values(userStats)
        .map(u => ({
            name: u.name,
            totalScore: u.totalScore,
            attempts: u.attempts,
            averageScore: Math.round(u.totalScore / u.attempts)
        }))
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 50); // Top 50

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Error generating leaderboard' });
  }
};

module.exports = { getLeaderboard };
