import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import { Award, CheckCircle, XCircle, Clock, ChevronRight } from 'lucide-react';

const StudentResults = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/student/attempts');
        setAttempts(response.data);
      } catch (err) {
        setError('Failed to fetch your results.');
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  if (loading) return <div className="animate-pulse h-64 bg-slate-300  rounded-2xl w-full"></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800  flex items-center gap-3">
          <Award className="text-emerald-600" size={32} />
          My Results
        </h1>
        <p className="text-slate-500  mt-2">Track your past performance and improvements.</p>
      </div>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50   border border-red-200 ">
          {error}
        </div>
      )}

      {attempts.length === 0 ? (
        <div className="py-12 text-center text-slate-500  bg-slate-50  rounded-2xl border border-slate-200 ">
          <Award className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p>You haven't taken any quizzes yet.</p>
          <Link to="/student/quizzes" className="text-emerald-600 font-medium hover:underline mt-2 inline-block">Browse available quizzes</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {attempts.map(attempt => (
            <Link key={attempt._id} to={`/student/results/${attempt._id}`} className="block group">
              <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-emerald-200 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {attempt.assessment?.category && (
                      <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full mb-2">
                        {attempt.assessment.category.name}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{attempt.assessment?.title || 'Deleted Assessment'}</h3>
                  </div>
                  <ChevronRight className="text-slate-400 group-hover:text-emerald-500 transition-colors mt-1" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-100  p-3 rounded-xl">
                    <p className="text-xs text-slate-500 font-medium mb-1">Score</p>
                    <p className="text-lg font-bold text-slate-800 ">
                      {attempt.score} <span className="text-sm font-normal text-slate-500">/ {attempt.assessment?.totalMarks || '?'}</span>
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${attempt.isPassed ? 'bg-emerald-50  text-emerald-700 ' : 'bg-red-50  text-red-700 '}`}>
                    <p className="text-xs font-medium mb-1 opacity-80">Status</p>
                    <p className="text-lg font-bold flex items-center gap-1">
                      {attempt.isPassed ? <><CheckCircle size={18} /> Passed</> : <><XCircle size={18} /> Failed</>}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-slate-500  border-t border-slate-200  pt-4">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    {Math.floor(attempt.timeSpentSeconds / 60)}m {attempt.timeSpentSeconds % 60}s
                  </div>
                  <div>
                    {new Date(attempt.startedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentResults;
