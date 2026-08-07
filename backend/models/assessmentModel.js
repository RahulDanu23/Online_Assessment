const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: [v => v.length >= 2, 'A question must have at least 2 options.']
  },
  correctOptionIndex: {
    type: Number,
    required: true,
    min: 0
  },
  marks: {
    type: Number,
    default: 1
  },
  explanation: {
    type: String
  }
});

const assessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  durationMinutes: {
    type: Number,
    required: true,
    min: 1
  },
  totalMarks: {
    type: Number,
    default: 0
  },
  passingMarks: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  questions: [questionSchema]
}, { timestamps: true });

// Pre-save hook to calculate total marks based on questions
assessmentSchema.pre('save', function () {
  if (this.questions && this.questions.length > 0) {
    this.totalMarks = this.questions.reduce((total, q) => total + (q.marks || 1), 0);
  } else {
    this.totalMarks = 0;
  }
});

module.exports = mongoose.model('Assessment', assessmentSchema);