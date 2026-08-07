import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, EyeOff, BookOpen, Clock } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';

const AdminAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/assessments');
      setAssessments(response.data);
    } catch (err) {
      setError('Failed to fetch assessments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleTogglePublish = async (id) => {
    try {
      await api.patch(`/admin/assessments/${id}/publish`);
      fetchAssessments();
    } catch (err) {
      setError('Failed to update publish status');
    }
  };

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/assessments/${deleteModal.id}`);
      fetchAssessments();
    } catch (err) {
      setError('Failed to delete assessment');
    }
  };

  if (loading && assessments.length === 0) {
    return <div className="animate-pulse h-64 bg-slate-300  rounded-2xl w-full"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800  flex items-center gap-3">
            <BookOpen className="text-indigo-600" size={32} />
            Assessments
          </h1>
          <p className="text-slate-500  mt-2">Manage your quizzes and questions.</p>
        </div>
        <Link
          to="/admin/assessments/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200 "
        >
          <Plus size={20} />
          Create New Quiz
        </Link>
      </div>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50   border border-red-200 ">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.length === 0 ? (
          <div className="col-span-full bg-slate-50  rounded-2xl p-8 text-center border border-slate-200 ">
            <BookOpen className="mx-auto h-12 w-12 text-slate-400 mb-3" />
            <h3 className="text-lg font-medium text-slate-800 ">No quizzes yet</h3>
            <p className="text-slate-500 mt-1">Get started by creating a new assessment.</p>
            <Link to="/admin/assessments/new" className="text-indigo-600 font-medium hover:underline mt-4 inline-block">Create one now</Link>
          </div>
        ) : (
          assessments.map((assessment) => (
            <div key={assessment._id} className="bg-slate-50  rounded-2xl shadow-sm border border-slate-200  overflow-hidden hover:shadow-md transition-all flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${assessment.isPublished ? 'bg-green-100 text-green-700  ' : 'bg-amber-100 text-amber-700  '}`}>
                    {assessment.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <div className="flex gap-2 text-slate-500 text-sm font-medium items-center">
                    <Clock size={16} />
                    {assessment.durationMinutes}m
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800  mb-2 line-clamp-1">{assessment.title}</h3>
                <p className="text-sm text-slate-500  mb-4 line-clamp-2">{assessment.description || 'No description provided.'}</p>
                <div className="flex gap-3 text-sm font-medium text-slate-600 ">
                  <span className="bg-slate-200  px-3 py-1 rounded-lg">{assessment.questions?.length || 0} Questions</span>
                  <span className="bg-slate-200  px-3 py-1 rounded-lg">{assessment.totalMarks} Marks</span>
                </div>
              </div>
              <div className="bg-slate-100  p-4 border-t border-slate-200  flex justify-between items-center">
                <button
                  onClick={() => handleTogglePublish(assessment._id)}
                  className={`flex items-center gap-1 text-sm font-medium ${assessment.isPublished ? 'text-amber-600 hover:text-amber-700' : 'text-green-600 hover:text-green-700'}`}
                >
                  {assessment.isPublished ? <><EyeOff size={16} /> Unpublish</> : <><Eye size={16} /> Publish</>}
                </button>
                <div className="flex gap-2">
                  <Link
                    to={`/admin/assessments/edit/${assessment._id}`}
                    className="p-2 text-blue-600 hover:bg-blue-100 :bg-blue-900/30 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(assessment._id)}
                    className="p-2 text-red-600 hover:bg-red-100 :bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Delete Quiz"
        message="Are you sure you want to delete this quiz? All related attempts will also be permanently deleted."
        confirmText="Delete"
      />
    </div>
  );
};

export default AdminAssessments;
