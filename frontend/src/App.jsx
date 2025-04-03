import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layouts
import StudentLayout from './layouts/StudentLayout';
import TeacherLayout from './layouts/TeacherLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Signup from './pages/public/Signup';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentCalendar from './pages/student/Calendar';
import ClassView from './pages/student/ClassView';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherSchedule from './pages/teacher/Schedule';
import TeacherClassView from './pages/teacher/ClassView';  // Add this line

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Classes from './pages/admin/Classes';
import Teachers from './pages/admin/Teachers';
import Students from './pages/admin/Students';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Student Routes */}
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
              <StudentLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="calendar" element={<StudentCalendar />} />
            <Route path="class/:id" element={<ClassView />} />
          </Route>
          
          {/* Teacher Routes */}
          <Route path="/teacher" element={
            <ProtectedRoute allowedRoles={['teacher', 'admin']}>
              <TeacherLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<TeacherDashboard />} />
          </Route>

          {/* Separate route for ClassView */}
          <Route path="/teacher/class/:id" element={
            <ProtectedRoute allowedRoles={['teacher', 'admin']}>
              <TeacherClassView />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
