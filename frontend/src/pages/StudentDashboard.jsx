import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Compass, Award, CheckCircle } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    attempts: [],
    availableQuizzes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [attemptsRes, quizzesRes] = await Promise.all([
          api.get('/student/attempts'),
          api.get('/student/assessments')
        ]);
        setStats({
          attempts: attemptsRes.data,
          availableQuizzes: quizzesRes.data.length
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const completedCount = stats.attempts.length;
  const avgScore = completedCount > 0 
    ? stats.attempts.reduce((acc, curr) => acc + (curr.score / (curr.assessment?.totalMarks || 1)), 0) / completedCount * 100 
    : 0;

  if (loading) {
    return <div className="animate-pulse h-64 bg-slate-300  rounded-2xl w-full"></div>;
  }

  const statCards = [
    { title: 'Available Quizzes', value: stats.availableQuizzes, icon: Compass, color: 'text-indigo-600', bg: 'bg-indigo-100 ' },
    { title: 'Completed Quizzes', value: completedCount, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100 ' },
    { title: 'Average Score', value: `${avgScore.toFixed(0)}%`, icon: Award, color: 'text-amber-600', bg: 'bg-amber-100 ' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 ">Student Dashboard</h1>
        <p className="text-slate-500  mt-2">Welcome back, {user?.name}. Ready to test your knowledge?</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-slate-50  p-6 rounded-2xl shadow-sm border border-slate-200  hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 ">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-800  mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
