const Assessment = require('../models/assessmentModel');

const createAssessment = async (req, res) => {
  try {
    const { title, description, category, durationMinutes, passingMarks, isPublished, questions } = req.body;

    // Validate required fields
    if (!title || !durationMinutes || !category) {
      return res.status(400).json({ message: 'Title, category, and duration are required.' });
    }

    const assessment = new Assessment({
      title,
      description,
      category,
      durationMinutes,
      passingMarks,
      isPublished: isPublished || false,
      questions: questions || [],
      createdBy: req.user.id // Assuming authMiddleware attaches the logged-in user to req.user
    });

    const createdAssessment = await assessment.save();
    res.status(201).json(createdAssessment);
  } catch (error) {
    console.error('Error creating assessment:', error);
    res.status(500).json({ message: 'Server error while creating assessment.', error: error.message });
  }
};

const getAdminAssessments = async (req, res) => {
  try {
    // Admin only sees assessments they created
    const assessments = await Assessment.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(assessments);
  } catch (error) {
    console.error('Error fetching admin assessments:', error);
    res.status(500).json({ message: 'Server error while fetching assessments.' });
  }
};

const getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    // Ensure the admin requesting it is the owner
    if (assessment.createdBy.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view this assessment' });
    }

    res.status(200).json(assessment);
  } catch (error) {
    console.error('Error fetching assessment details:', error);
    res.status(500).json({ message: 'Server error while fetching assessment.' });
  }
};

const updateAssessment = async (req, res) => {
  try {
    const { title, description, category, durationMinutes, passingMarks, questions } = req.body;

    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    if (assessment.createdBy.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this assessment' });
    }

    assessment.title = title || assessment.title;
    assessment.description = description !== undefined ? description : assessment.description;
    assessment.category = category || assessment.category;
    assessment.durationMinutes = durationMinutes || assessment.durationMinutes;
    assessment.passingMarks = passingMarks !== undefined ? passingMarks : assessment.passingMarks;
    
    if (questions) {
        assessment.questions = questions;
    }

    const updatedAssessment = await assessment.save();
    res.status(200).json(updatedAssessment);
  } catch (error) {
    console.error('Error updating assessment:', error);
    res.status(500).json({ message: 'Server error while updating assessment.' });
  }
};

const togglePublishStatus = async (req, res) => {
    try {
        const assessment = await Assessment.findById(req.params.id);
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }

        if (assessment.createdBy.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this assessment' });
        }

        assessment.isPublished = !assessment.isPublished;
        const updatedAssessment = await assessment.save();
        
        res.status(200).json({ 
            message: `Assessment ${assessment.isPublished ? 'published' : 'unpublished'} successfully`, 
            isPublished: assessment.isPublished 
        });
    } catch (error) {
        console.error('Error toggling publish status:', error);
        res.status(500).json({ message: 'Server error while updating publish status.' });
    }
};

const deleteAssessment = async (req, res) => {
    try {
        const assessment = await Assessment.findById(req.params.id);
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }

        if (assessment.createdBy.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this assessment' });
        }

        await assessment.deleteOne();
        res.status(200).json({ message: 'Assessment deleted successfully' });
    } catch (error) {
        console.error('Error deleting assessment:', error);
        res.status(500).json({ message: 'Server error while deleting assessment.' });
    }
};

const getPublishedAssessments = async (req, res) => {
    try {
        const assessments = await Assessment.find({ isPublished: true })
            .select('-questions') // Exclude questions array from the list view
            .populate('createdBy', 'name') // Populate creator's name if needed
            .populate('category', 'name')
            .sort({ createdAt: -1 });
            
        res.status(200).json(assessments);
    } catch (error) {
        console.error('Error fetching published assessments:', error);
        res.status(500).json({ message: 'Server error while fetching assessments.' });
    }
};

const getAssessmentForStudent = async (req, res) => {
    try {
        // Fetch assessment and omit correctOptionIndex and explanation from questions
        const assessment = await Assessment.findOne({ _id: req.params.id, isPublished: true })
            .select('-questions.correctOptionIndex -questions.explanation')
            .populate('category', 'name');
            
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found or not published' });
        }

        res.status(200).json(assessment);
    } catch (error) {
        console.error('Error fetching assessment for student:', error);
        res.status(500).json({ message: 'Server error while fetching assessment.' });
    }
};


module.exports = {
  createAssessment,
  getAdminAssessments,
  getAssessmentById,
  updateAssessment,
  togglePublishStatus,
  deleteAssessment,
  getPublishedAssessments,
  getAssessmentForStudent
};
