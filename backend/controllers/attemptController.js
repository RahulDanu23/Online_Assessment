const Attempt = require('../models/attemptModel');
const Assessment = require('../models/assessmentModel');

// @desc    Submit an assessment attempt
// @route   POST /api/student/attempts
// @access  Private/Student
const submitAttempt = async (req, res) => {
  try {
    const { assessmentId, answers, timeSpentSeconds, startedAt } = req.body;
    
    // Fetch the true assessment to check correct answers
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    let totalScore = 0;
    const processedAnswers = [];

    // Compare student answers with correct answers
    assessment.questions.forEach((question) => {
      // Find what the student answered for this question
      const studentAnswer = answers.find(a => a.questionId === question._id.toString());
      
      let isCorrect = false;
      let selectedOptionIndex = null;

      if (studentAnswer && studentAnswer.selectedOptionIndex !== null && studentAnswer.selectedOptionIndex !== undefined) {
        selectedOptionIndex = parseInt(studentAnswer.selectedOptionIndex);
        if (selectedOptionIndex === question.correctOptionIndex) {
          isCorrect = true;
          totalScore += question.marks || 1;
        }
      }

      processedAnswers.push({
        questionId: question._id,
        selectedOptionIndex,
        isCorrect
      });
    });

    const isPassed = totalScore >= assessment.passingMarks;

    const attempt = new Attempt({
      student: req.user.id,
      assessment: assessmentId,
      answers: processedAnswers,
      score: totalScore,
      isPassed,
      timeSpentSeconds,
      startedAt
    });

    const savedAttempt = await attempt.save();
    res.status(201).json(savedAttempt);
  } catch (error) {
    console.error('Error submitting attempt:', error);
    res.status(500).json({ message: 'Server error while submitting attempt' });
  }
};

// @desc    Get all attempts for the logged-in student
// @route   GET /api/student/attempts
// @access  Private/Student
const getStudentAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find({ student: req.user.id })
      .populate('assessment', 'title totalMarks durationMinutes')
      .sort({ createdAt: -1 });
    res.status(200).json(attempts);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching attempts' });
  }
};

// @desc    Get details of a specific attempt
// @route   GET /api/student/attempts/:id
// @access  Private/Student
const getAttemptDetails = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.id)
      .populate({
          path: 'assessment',
          populate: { path: 'category' }
      });
      
    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }
    
    if (attempt.student.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json(attempt);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching attempt details' });
  }
};

// @desc    Get all attempts across all students (Admin)
// @route   GET /api/admin/attempts
// @access  Private/Admin
const getAllAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find()
      .populate('student', 'name email')
      .populate('assessment', 'title totalMarks')
      .sort({ createdAt: -1 });
    res.status(200).json(attempts);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching all attempts' });
  }
};

module.exports = {
  submitAttempt,
  getStudentAttempts,
  getAttemptDetails,
  getAllAttempts
};
