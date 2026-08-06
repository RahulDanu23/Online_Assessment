import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './Pages/Login'
import AdminDashboard from './Pages/AdminDashboard'
import StudentProfile from './Pages/StudentProfile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
