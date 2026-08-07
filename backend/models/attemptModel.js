const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    selectedOptionIndex: {
      type: Number, // Can be null if the student didn't answer
      default: null
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  score: {
    type: Number,
    required: true
  },
  isPassed: {
    type: Boolean,
    required: true
  },
  timeSpentSeconds: {
    type: Number,
    required: true
  },
  startedAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Attempt', attemptSchema);
