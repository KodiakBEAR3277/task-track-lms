import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
  TextField // Added TextField import
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import studentApi from '../../services/studentApi';
import JoinClassDialog from '../../components/JoinClassDialog';

// Update ClassCard styled component to match TeacherDashboard
const ClassCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#222222',
  color: 'white',
  padding: theme.spacing(3),
  borderRadius: '8px',
  height: '100%',
  cursor: 'pointer',
  transition: 'transform 0.2s, background-color 0.2s',
  '&:hover': {
    backgroundColor: '#2a2a2a',
    transform: 'translateY(-4px)'
  }
}));

// Add ClassCode styled component from TeacherDashboard
const ClassCode = styled(Typography)({
  backgroundColor: '#333333',
  color: '#FFC600',
  padding: '4px 8px',
  borderRadius: '4px',
  display: 'inline-block',
  fontSize: '0.875rem',
  fontWeight: 500,
});

// Remove ClassCodeInput since it's not used in the updated version
// (It seems to be a leftover from a previous implementation)

// Add error boundary component (unchanged)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dashboard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, color: 'white' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Something went wrong. Please try refreshing the page.
            {process.env.NODE_ENV === 'development' && (
              <pre style={{ whiteSpace: 'pre-wrap' }}>
                {this.state.error?.toString()}
              </pre>
            )}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ bgcolor: '#FFC600', color: '#000' }}
          >
            Refresh Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

function StudentDashboard() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);

  // Fetch enrolled classes
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.getEnrolledClasses();
      console.log('Fetched classes data:', data);
      setClasses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async (classCode) => {
    try {
      const result = await studentApi.joinClass(classCode);
      console.log('Join class result:', result);
      
      // Immediately fetch updated classes after joining
      await fetchClasses();
      
      setIsJoinDialogOpen(false);
      setError(null);
    } catch (err) {
      console.error('Failed to join class:', err);
      throw new Error(err.error || 'Failed to join class');
    }
  };

  const handleLeaveClass = async () => {
    if (!selectedClass) return;
    
    try {
      setError(null);
      setLoading(true);
      
      await studentApi.leaveClass(selectedClass.id);
      
      // Refresh the class list
      await fetchClasses();
      
      // Close dialogs and reset state
      setConfirmDialog(false);
      setSelectedClass(null);
      setMenuAnchor(null);
      
    } catch (err) {
      console.error('Leave class error:', err);
      setError(err.message || 'Failed to leave class');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Typography variant="h4" sx={{ color: 'white' }}>
          My Classes
        </Typography>
        <Button
          variant="contained"
          onClick={() => setIsJoinDialogOpen(true)}
          sx={{
            bgcolor: '#FFC600',
            color: 'black',
            '&:hover': { bgcolor: '#FFD700' }
          }}
        >
          Join Class
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {classes.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 4, 
          color: '#666',
          bgcolor: '#222222',
          borderRadius: 1
        }}>
          <Typography>
            You haven't joined any classes yet.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {classes.map((classItem) => (
            <Grid item xs={12} sm={6} md={4} key={classItem.id}>
              <ClassCard 
                onClick={() => navigate(`/student/classes/${classItem.id}`)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <ClassCode>{classItem.code}</ClassCode>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedClass(classItem);
                      setMenuAnchor(e.currentTarget);
                    }}
                    sx={{ color: 'white' }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {classItem.name}
                </Typography>
                {classItem.schedule && (
                  <Typography variant="body2" sx={{ color: '#999', mb: 1 }}>
                    {classItem.schedule}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ color: '#999', mt: 2 }}>
                  Teacher: {classItem.teacher_name}
                </Typography>
                {classItem.student_count > 0 && (
                  <Typography variant="body2" sx={{ color: '#999', mt: 1 }}>
                    {classItem.student_count} Student{classItem.student_count !== 1 ? 's' : ''}
                  </Typography>
                )}
              </ClassCard>
            </Grid>
          ))}
        </Grid>
      )}

      <JoinClassDialog
        open={isJoinDialogOpen}
        onClose={() => setIsJoinDialogOpen(false)}
        onJoin={handleJoinClass}
      />

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        PaperProps={{
          sx: { bgcolor: '#333333' }
        }}
      >
        <MenuItem 
          onClick={() => {
            setMenuAnchor(null);
            setConfirmDialog(true);
          }}
          sx={{ color: '#FF4444' }}
        >
          Leave Class
        </MenuItem>
      </Menu>

      <Dialog
        open={confirmDialog}
        onClose={() => setConfirmDialog(false)}
        PaperProps={{
          sx: { bgcolor: '#222222', color: 'white' }
        }}
      >
        <DialogTitle>Leave Class</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to leave {selectedClass?.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)} sx={{ color: '#999' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleLeaveClass}
            sx={{ color: '#FF4444' }}
          >
            Leave
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Wrap the dashboard component with error boundary
function StudentDashboardWrapper() {
  return (
    <ErrorBoundary>
      <StudentDashboard />
    </ErrorBoundary>
  );
}

export default StudentDashboardWrapper;