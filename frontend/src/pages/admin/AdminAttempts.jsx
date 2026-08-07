import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Users, CheckCircle, XCircle, Clock } from 'lucide-react';

const AdminAttempts = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/attempts');
        setAttempts(response.data);
      } catch (err) {
        setError('Failed to fetch student attempts');
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  if (loading) {
    return <div className="animate-pulse h-64 bg-slate-300  rounded-2xl w-full"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800  flex items-center gap-3">
          <Users className="text-purple-600" size={32} />
          Student Results
        </h1>
        <p className="text-slate-500  mt-2">Monitor student performance and quiz attempts.</p>
      </div>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50   border border-red-200 ">
          {error}
        </div>
      )}

      <div className="bg-slate-50  rounded-2xl shadow-sm border border-slate-200  overflow-hidden">
        {attempts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 ">
            No attempts have been made yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 ">
              <thead className="text-xs text-slate-700 uppercase bg-slate-100   border-b ">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Assessment</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Time Spent</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 ">
                {attempts.map((attempt) => (
                  <tr key={attempt._id} className="hover:bg-slate-100 :bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800 ">
                      {attempt.student?.name || 'Unknown User'}
                    </td>
                    <td className="px-6 py-4">
                      {attempt.assessment?.title || 'Deleted Assessment'}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {attempt.score} / {attempt.assessment?.totalMarks || '?'}
                    </td>
                    <td className="px-6 py-4">
                      {attempt.isPassed ? (
                        <span className="flex items-center gap-1 text-emerald-600  font-medium bg-emerald-50  px-2 py-1 rounded-full w-max">
                          <CheckCircle size={14} /> Passed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600  font-medium bg-red-50  px-2 py-1 rounded-full w-max">
                          <XCircle size={14} /> Failed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock size={14} /> {Math.floor(attempt.timeSpentSeconds / 60)}m {attempt.timeSpentSeconds % 60}s
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(attempt.startedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAttempts;
