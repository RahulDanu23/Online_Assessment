import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Users, BookOpen, CheckCircle, BarChart3 } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAssessments: 0,
    totalAttempts: 0,
    passRate: 0,
    passedAttempts: 0,
    failedAttempts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/analytics');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="animate-pulse h-64 bg-slate-300  rounded-2xl w-full"></div>;
  }

  const statCards = [
    { title: 'Total Students', value: stats.totalStudents || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100 ' },
    { title: 'Assessments', value: stats.totalAssessments || 0, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-100 ' },
    { title: 'Total Attempts', value: stats.totalAttempts || 0, icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-100 ' },
    { title: 'Pass Rate', value: `${(stats.passRate || 0)}%`, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100 ' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 ">Dashboard Overview</h1>
        <p className="text-slate-500  mt-2">Welcome back, {user?.name}. Here's what's happening today.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200 mt-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Performance Analytics</h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm font-medium text-slate-600 mb-2">
              <span>Pass vs Fail Ratio</span>
              <span>{stats.passRate || 0}% Passed</span>
            </div>
            
            {/* Chart Bar */}
            <div className="h-6 w-full bg-red-100 rounded-full overflow-hidden flex shadow-inner">
              <div 
                className="bg-emerald-500 h-full flex items-center justify-center text-xs text-white font-bold transition-all duration-1000 ease-in-out" 
                style={{ width: `${stats.passRate || 0}%` }}
              >
                {stats.passedAttempts > 0 && stats.passedAttempts}
              </div>
              <div 
                className="bg-red-500 h-full flex items-center justify-center text-xs text-white font-bold transition-all duration-1000 ease-in-out"
                style={{ width: `${100 - (stats.passRate || 0)}%` }}
              >
                {stats.failedAttempts > 0 && stats.failedAttempts}
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-medium text-slate-600">Passed ({stats.passedAttempts || 0})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium text-slate-600">Failed ({stats.failedAttempts || 0})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
