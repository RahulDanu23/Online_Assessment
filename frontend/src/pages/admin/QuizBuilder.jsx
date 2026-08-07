import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Plus, Trash2, ArrowLeft, GripVertical } from 'lucide-react';

const QuizBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    durationMinutes: 30,
    passingMarks: 50,
  });

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, quizRes] = await Promise.all([
          api.get('/admin/categories'),
          isEditing ? api.get(`/admin/assessments/${id}`) : Promise.resolve({ data: null })
        ]);
        
        setCategories(catRes.data);
        
        if (isEditing && quizRes.data) {
          const qz = quizRes.data;
          setFormData({
            title: qz.title,
            description: qz.description,
            category: qz.category._id || qz.category,
            durationMinutes: qz.durationMinutes,
            passingMarks: qz.passingMarks,
          });
          setQuestions(qz.questions || []);
        } else if (catRes.data.length > 0) {
          setFormData(prev => ({ ...prev, category: catRes.data[0]._id }));
        }
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEditing]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        marks: 1,
        explanation: ''
      }
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleRemoveQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (questions.length === 0) {
      setError('Please add at least one question');
      return;
    }
    if (questions.length < 15) {
      // Just a warning for UI, backend doesn't restrict it but reqs asked for 15-20.
      console.warn("Recommendation: Aim for 15-20 questions for a comprehensive quiz.");
    }

    try {
      const payload = { ...formData, questions };
      if (isEditing) {
        await api.put(`/admin/assessments/${id}`, payload);
      } else {
        await api.post('/admin/assessments', payload);
      }
      navigate('/admin/assessments');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save quiz');
    }
  };

  if (loading) return <div className="animate-pulse h-64 bg-slate-300  rounded-2xl"></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/assessments')} className="p-2 bg-slate-50  rounded-lg border border-slate-300  hover:bg-slate-100 transition">
          <ArrowLeft size={20} className="text-slate-600 " />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 ">
            {isEditing ? 'Edit Quiz' : 'Create New Quiz'}
          </h1>
          <p className="text-slate-500 ">Aim for 15-20 questions per quiz.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200   ">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-slate-50  p-6 rounded-2xl shadow-sm border border-slate-200  space-y-6">
          <h2 className="text-xl font-semibold text-slate-800  border-b pb-3 ">Quiz Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <label className="block text-sm font-medium mb-1">Quiz Title</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border rounded-xl   focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Advanced Data Structures" />
            </div>
            <div className="col-span-full">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border rounded-xl   focus:ring-2 focus:ring-indigo-500 outline-none h-24" placeholder="What is this quiz about?" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 border rounded-xl   focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="">Select a Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Duration (Minutes)</label>
              <input type="number" min="1" required value={formData.durationMinutes} onChange={e => setFormData({...formData, durationMinutes: e.target.value})} className="w-full p-3 border rounded-xl   focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Passing Marks</label>
              <input type="number" min="1" required value={formData.passingMarks} onChange={e => setFormData({...formData, passingMarks: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-800 ">Questions ({questions.length})</h2>
            <button type="button" onClick={handleAddQuestion} className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200   px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition">
              <Plus size={18} /> Add Question
            </button>
          </div>

          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-slate-50  p-6 rounded-2xl shadow-sm border border-slate-300  relative">
              <div className="absolute top-6 left-2 text-slate-400 cursor-move"><GripVertical size={20} /></div>
              <div className="ml-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1 text-slate-700 ">Question {qIndex + 1}</label>
                    <textarea required value={q.questionText} onChange={e => handleQuestionChange(qIndex, 'questionText', e.target.value)} className="w-full p-3 border rounded-xl   focus:ring-2 focus:ring-indigo-500 outline-none h-20" placeholder="Type your question or code snippet here..." />
                  </div>
                  <button type="button" onClick={() => handleRemoveQuestion(qIndex)} className="text-red-500 hover:bg-red-50 :bg-red-900/30 p-2 rounded-lg transition mt-6">
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className={`flex items-center border rounded-xl p-2 transition ${q.correctOptionIndex === optIndex ? 'border-green-500 bg-green-50 ' : 'border-slate-300 '}`}>
                      <input type="radio" name={`correct-${qIndex}`} checked={q.correctOptionIndex === optIndex} onChange={() => handleQuestionChange(qIndex, 'correctOptionIndex', optIndex)} className="w-5 h-5 ml-2 text-green-600 focus:ring-green-500" />
                      <input type="text" required value={opt} onChange={e => handleOptionChange(qIndex, optIndex, e.target.value)} className="w-full p-2 bg-transparent outline-none ml-2 text-sm" placeholder={`Option ${optIndex + 1}`} />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Marks</label>
                    <input type="number" min="1" required value={q.marks} onChange={e => handleQuestionChange(qIndex, 'marks', parseInt(e.target.value))} className="w-full p-2 border rounded-lg   outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Explanation (Optional)</label>
                    <input type="text" value={q.explanation || ''} onChange={e => handleQuestionChange(qIndex, 'explanation', e.target.value)} className="w-full p-2 border rounded-lg   outline-none text-sm" placeholder="Why is this correct?" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Save Button */}
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-slate-50/80  backdrop-blur-md border-t  flex justify-end z-30">
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition transform hover:-translate-y-1">
            <Save size={20} />
            {isEditing ? 'Update Quiz' : 'Save & Create Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizBuilder;
