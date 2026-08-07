import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Edit2, Trash2, FolderKanban } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/categories');
      setCategories(response.data);
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/admin/categories/${editingId}`, formData);
      } else {
        await api.post('/admin/categories', formData);
      }
      setFormData({ name: '', description: '' });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormData({ name: category.name, description: category.description || '' });
  };

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/categories/${deleteModal.id}`);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category');
    }
  };

  if (loading && categories.length === 0) {
    return <div className="animate-pulse h-64 bg-slate-300  rounded-2xl w-full"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800  flex items-center gap-3">
          <FolderKanban className="text-blue-600" size={32} />
          Category Management
        </h1>
        <p className="text-slate-500  mt-2">Create and manage quiz subjects (e.g. Frontend, Core CS, DSA).</p>
      </div>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50   border border-red-200 ">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-slate-50  rounded-2xl shadow-sm border border-slate-200  p-6 sticky top-8">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 ">
              {editingId ? 'Edit Category' : 'Add New Category'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700  mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-slate-300  rounded-xl bg-slate-100  text-slate-800  focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Frontend"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700  mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border border-slate-300  rounded-xl bg-slate-100  text-slate-800  focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                  placeholder="Topics covered..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-medium transition-colors flex justify-center items-center gap-2"
                >
                  {editingId ? 'Update' : 'Create'}
                  <Plus size={18} />
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ name: '', description: '' });
                    }}
                    className="px-4 py-3 bg-slate-300  text-slate-700  rounded-xl font-medium hover:bg-gray-300 :bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          <div className="bg-slate-50  rounded-2xl shadow-sm border border-slate-200  overflow-hidden">
            {categories.length === 0 ? (
              <div className="p-8 text-center text-slate-500 ">
                No categories found. Create one to get started!
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 ">
                {categories.map((category) => (
                  <li key={category._id} className="p-6 hover:bg-slate-100 :bg-gray-700/50 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800 ">{category.name}</h4>
                      {category.description && (
                        <p className="text-slate-500  text-sm mt-1">{category.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 :bg-blue-900/30 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="p-2 text-red-600 hover:bg-red-50 :bg-red-900/30 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      
      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default CategoryManager;
