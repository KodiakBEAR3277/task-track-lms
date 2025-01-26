import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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
import TeacherClasses from './pages/teacher/Classes';
import TeacherSchedule from './pages/teacher/Schedule';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Classes from './pages/admin/Classes';
import Teachers from './pages/admin/Teachers';
import Students from './pages/admin/Students';

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFC600',
    },
    secondary: {
      main: '#222222',
    },
    background: {
      default: '#111111',
      paper: '#222222',
    },
  },
});

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
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/calendar" element={<StudentCalendar />} />
          <Route path="/student/class/:id" element={<ClassView />} />
          
          {/* Teacher Routes */}
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/schedule" element={<TeacherSchedule />} />
          <Route path="/teacher/classes/:id" element={<TeacherClasses />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/teachers" element={<Teachers />} />
          <Route path="/admin/students" element={<Students />} />
          <Route path="/admin/classes" element={<Classes />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
