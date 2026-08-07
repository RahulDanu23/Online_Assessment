import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';

const QuizPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedIndex }
  const [flagged, setFlagged] = useState({}); // { questionId: true/false }
  
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(null); // in seconds
  const [startedAt, setStartedAt] = useState(null);

  // Fetch Quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/student/assessments/${id}`);
        setQuiz(response.data);
        setTimeLeft(response.data.durationMinutes * 60);
        setStartedAt(new Date().toISOString());
      } catch (err) {
        setError('Failed to load quiz. It may not be available.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  // Timer Countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submitting) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit when timer reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitting]);

  const handleSelectOption = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleToggleFlag = (questionId) => {
    setFlagged({ ...flagged, [questionId]: !flagged[questionId] });
  };

  const handleSubmit = async () => {
    if (submitting) return;
    
    // Formatting answers for backend
    const formattedAnswers = Object.keys(answers).map(qId => ({
      questionId: qId,
      selectedOptionIndex: answers[qId]
    }));

    const timeSpentSeconds = (quiz.durationMinutes * 60) - timeLeft;

    try {
      setSubmitting(true);
      const response = await api.post('/student/attempts', {
        assessmentId: quiz._id,
        answers: formattedAnswers,
        timeSpentSeconds: timeSpentSeconds,
        startedAt: startedAt
      });
      
      // Navigate to results
      navigate(`/student/results/${response.data._id}`);
    } catch (err) {
      setError('Failed to submit quiz. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-emerald-600">Loading quiz...</div>;
  if (error || !quiz) return <div className="text-center mt-20 text-red-600">{error || 'Quiz not found'}</div>;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  
  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
      
      {/* Left Column - Main Question Area */}
      <div className="flex-1 space-y-6">
        <div className="bg-slate-50  p-6 rounded-2xl shadow-sm border border-slate-200  flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-800 ">{quiz.title}</h1>
          <div className="flex items-center gap-2 bg-emerald-50  text-emerald-700  px-4 py-2 rounded-xl font-mono font-bold text-lg">
            <Clock size={20} />
            <span className={timeLeft < 60 ? 'text-red-500 animate-pulse' : ''}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="bg-slate-50  p-8 rounded-2xl shadow-sm border border-slate-200  min-h-[400px] flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-lg font-semibold text-slate-500 ">Question {currentQuestionIndex + 1} of {quiz.questions.length}</h2>
            <button 
              onClick={() => handleToggleFlag(currentQuestion._id)}
              className={`p-2 rounded-lg flex items-center gap-2 transition ${flagged[currentQuestion._id] ? 'bg-amber-100 text-amber-600' : 'text-slate-400 hover:bg-slate-200 :bg-gray-700'}`}
            >
              <Flag size={18} fill={flagged[currentQuestion._id] ? "currentColor" : "none"} />
              <span className="text-sm font-medium hidden sm:inline">Flag for review</span>
            </button>
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-medium text-slate-800  mb-8 whitespace-pre-wrap">{currentQuestion.questionText}</h3>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = answers[currentQuestion._id] === index;
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectOption(currentQuestion._id, index)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-50  text-emerald-700 ' 
                        : 'border-slate-300  hover:border-emerald-200 :border-emerald-700 hover:bg-slate-100 :bg-gray-750'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-emerald-500' : 'border-gray-300'}`}>
                      {isSelected && <div className="w-3 h-3 rounded-full bg-emerald-500" />}
                    </div>
                    <span className="text-lg">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-12 flex justify-between items-center border-t border-slate-200  pt-6">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-slate-600  hover:bg-slate-200 :bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={20} /> Previous
            </button>

            {!isLastQuestion ? (
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium bg-emerald-100 text-emerald-700   hover:bg-emerald-200 :bg-emerald-900/50 transition"
              >
                Next <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={() => setSubmitModalOpen(true)}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition"
              >
                <CheckCircle size={20} /> {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Navigation Sidebar */}
      <div className="lg:w-72 bg-slate-50  p-6 rounded-2xl shadow-sm border border-slate-200  h-max sticky top-8">
        <h3 className="font-semibold text-slate-800  mb-4">Question Navigator</h3>
        <div className="grid grid-cols-5 gap-2">
          {quiz.questions.map((q, idx) => {
            const isAnswered = answers[q._id] !== undefined;
            const isFlagged = flagged[q._id];
            const isCurrent = currentQuestionIndex === idx;

            let bgColor = 'bg-slate-200  text-slate-600 ';
            let borderColor = 'border-transparent';

            if (isCurrent) {
              borderColor = 'border-emerald-500';
            }
            if (isAnswered) {
              bgColor = 'bg-emerald-500 text-white';
            }
            if (isFlagged && !isAnswered) {
              bgColor = 'bg-amber-400 text-white';
            } else if (isFlagged && isAnswered) {
              // Answered but flagged
              bgColor = 'bg-emerald-500 text-white';
              borderColor = 'border-amber-400';
            }

            return (
              <button
                key={q._id}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm transition-all border-2 ${bgColor} ${borderColor}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        
        <div className="mt-8 space-y-3 text-sm text-slate-600 ">
          <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-emerald-500"></div> Answered</div>
          <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-amber-400"></div> Flagged</div>
          <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-slate-200 border-2 border-emerald-500"></div> Current</div>
          <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-slate-100"></div> Unanswered</div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onConfirm={handleSubmit}
        title="Submit Assessment"
        message="Are you sure you want to submit? You will not be able to change your answers after this."
        confirmText="Submit"
      />
    </div>
  );
};

export default QuizPlayer;
