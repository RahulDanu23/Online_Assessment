import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import { Compass, Clock, BookOpen, ChevronRight } from 'lucide-react';

const QuizCatalog = () => {
  const [assessments, setAssessments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [assessRes, catRes] = await Promise.all([
          api.get('/student/assessments'),
          api.get('/student/categories')
        ]);
        setAssessments(assessRes.data);
        setCategories(catRes.data);
      } catch (err) {
        setError('Failed to fetch quizzes. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAssessments = activeCategory === 'All' 
    ? assessments 
    : assessments.filter(a => a.category?._id === activeCategory);

  if (loading && assessments.length === 0) {
    return <div className="animate-pulse h-64 bg-slate-300  rounded-2xl w-full"></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800  flex items-center gap-3">
          <Compass className="text-emerald-600" size={32} />
          Browse Quizzes
        </h1>
        <p className="text-slate-500  mt-2">Test your knowledge across various subjects.</p>
      </div>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50   border border-red-200 ">
          {error}
        </div>
      )}

      {/* Categories Filter */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveCategory('All')}
          className={`whitespace-nowrap px-4 py-2 rounded-xl font-medium transition-colors ${
            activeCategory === 'All'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 '
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-300    :bg-gray-700'
          }`}
        >
          All Subjects
        </button>
        {categories.map(cat => (
          <button
            key={cat._id}
            onClick={() => setActiveCategory(cat._id)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl font-medium transition-colors ${
              activeCategory === cat._id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 '
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-300    :bg-gray-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssessments.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500  bg-slate-50  rounded-2xl border border-slate-200 ">
            No quizzes available for this category yet. Check back later!
          </div>
        ) : (
          filteredAssessments.map(quiz => (
            <div key={quiz._id} className="bg-slate-50  rounded-2xl shadow-sm border border-slate-200  overflow-hidden hover:shadow-lg transition-all group flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700   text-xs font-bold rounded-full">
                    {quiz.category?.name || 'Uncategorized'}
                  </span>
                  <div className="flex items-center gap-1 text-slate-500 text-sm font-medium">
                    <Clock size={16} /> {quiz.durationMinutes}m
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800  mb-2 line-clamp-2">{quiz.title}</h3>
                <p className="text-sm text-slate-500  mb-6 line-clamp-3">{quiz.description}</p>
                
                <div className="flex gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600 ">
                    <BookOpen size={16} className="text-slate-400" />
                    <span>{quiz.questions?.length || 0} Questions</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-slate-100  border-t border-slate-200 ">
                <Link
                  to={`/student/quiz/${quiz._id}`}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-50  border border-slate-300  hover:border-emerald-500 hover:text-emerald-600 :border-emerald-500 :text-emerald-400 rounded-xl font-semibold transition-colors group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600"
                >
                  Start Assessment
                  <ChevronRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuizCatalog;
