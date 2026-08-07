import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Components
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import CategoryManager from './pages/admin/CategoryManager';
import AdminAssessments from './pages/admin/AdminAssessments';
import QuizBuilder from './pages/admin/QuizBuilder';
import AdminAttempts from './pages/admin/AdminAttempts';

// Student Components
import StudentLayout from './components/StudentLayout';
import StudentDashboard from './pages/StudentDashboard';
import QuizCatalog from './pages/student/QuizCatalog';
import QuizPlayer from './pages/student/QuizPlayer';
import StudentResults from './pages/student/StudentResults';
import ScoreCard from './pages/student/ScoreCard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            } 
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="categories" element={<CategoryManager />} />
            <Route path="assessments" element={<AdminAssessments />} />
            <Route path="assessments/new" element={<QuizBuilder />} />
            <Route path="assessments/edit/:id" element={<QuizBuilder />} />
            <Route path="attempts" element={<AdminAttempts />} />
          </Route>

          {/* Student Routes */}
          <Route 
            path="/student" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentLayout />
              </ProtectedRoute>
            } 
          >
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="quizzes" element={<QuizCatalog />} />
            <Route path="results" element={<StudentResults />} />
            <Route path="results/:id" element={<ScoreCard />} />
          </Route>

          {/* Quiz Player (Full Screen, outside Layout) */}
          <Route 
            path="/student/quiz/:id" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <div className="min-h-screen bg-slate-100  py-8 px-4 font-sans">
                  <QuizPlayer />
                </div>
              </ProtectedRoute>
            } 
          />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
