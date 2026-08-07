import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Award, Clock } from 'lucide-react';

const ScoreCard = () => {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const response = await api.get(`/student/attempts/${id}`);
        setAttempt(response.data);
      } catch (err) {
        setError('Failed to load result details.');
      } finally {
        setLoading(false);
      }
    };
    fetchAttempt();
  }, [id]);

  if (loading) return <div className="animate-pulse h-64 bg-slate-300  rounded-2xl max-w-4xl mx-auto"></div>;
  if (error || !attempt) return <div className="text-center mt-20 text-red-600">{error || 'Result not found'}</div>;

  const percentage = Math.round((attempt.score / attempt.assessment.totalMarks) * 100) || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/student/results" className="p-2 bg-slate-50  rounded-lg border border-slate-300  hover:bg-slate-100 transition">
          <ArrowLeft size={20} className="text-slate-600 " />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 ">Assessment Results</h1>
          <p className="text-slate-500 ">Review your performance for {attempt.assessment.title}</p>
        </div>
      </div>

      <div className="bg-slate-50  rounded-3xl shadow-lg border border-slate-200  overflow-hidden">
        {/* Header Banner */}
        <div className={`p-8 text-center text-white ${attempt.isPassed ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-red-500 to-rose-600'}`}>
          <div className="mx-auto w-24 h-24 bg-slate-50/20 rounded-full flex items-center justify-center backdrop-blur-sm mb-4 border-4 border-white/30">
            {attempt.isPassed ? <Award size={48} className="text-white" /> : <XCircle size={48} className="text-white" />}
          </div>
          <h2 className="text-4xl font-extrabold mb-2">{percentage}%</h2>
          <p className="text-lg font-medium text-white/90">
            {attempt.isPassed ? 'Congratulations, you passed!' : 'Unfortunately, you did not pass this time.'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100  border-b border-slate-200 ">
          <div className="p-6 text-center">
            <p className="text-sm text-slate-500  mb-1 font-medium">Score</p>
            <p className="text-2xl font-bold text-slate-800 ">{attempt.score} <span className="text-base font-normal text-slate-500">/ {attempt.assessment.totalMarks}</span></p>
          </div>
          <div className="p-6 text-center">
            <p className="text-sm text-slate-500  mb-1 font-medium">Passing Marks</p>
            <p className="text-2xl font-bold text-slate-800 ">{attempt.assessment.passingMarks}</p>
          </div>
          <div className="p-6 text-center">
            <p className="text-sm text-slate-500  mb-1 font-medium">Time Taken</p>
            <p className="text-2xl font-bold text-slate-800  flex justify-center items-center gap-1">
              {Math.floor(attempt.timeSpentSeconds / 60)}m {attempt.timeSpentSeconds % 60}s
            </p>
          </div>
          <div className="p-6 text-center">
            <p className="text-sm text-slate-500  mb-1 font-medium">Correct Answers</p>
            <p className="text-2xl font-bold text-emerald-600">{attempt.answers.filter(a => a.isCorrect).length}</p>
          </div>
        </div>
      </div>
      
      {/* We can map over the questions and answers here if the backend `getAttemptDetails` populates the assessment.questions. 
          Currently, the backend only populates 'assessment' and its 'category', but doesn't deep populate 'assessment.questions'.
          So for now, we will show a summary. To show deep review, the backend would need to return the questions text. */}
      
      <div className="text-center mt-8">
        <Link to="/student/quizzes" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors">
          Take Another Quiz
        </Link>
      </div>
    </div>
  );
};

export default ScoreCard;
