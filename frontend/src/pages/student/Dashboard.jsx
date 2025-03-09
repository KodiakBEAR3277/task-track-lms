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

// Keep only these styled components
const ClassCard = styled(Card)({
  backgroundColor: '#222222',
  color: 'white',
  padding: '20px',
  '&:hover': {
    backgroundColor: '#2a2a2a',
  }
});

const ClassCodeInput = styled('div')({
  display: 'flex',
  gap: '16px',
  marginBottom: '32px',
  '& .MuiTextField-root': {
    backgroundColor: '#222222',
    borderRadius: '4px',
    '& input': {
      color: 'white',
    }
  }
});

// Add error boundary component
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
  const [classCode, setClassCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);

  // Fetch enrolled classes
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await studentApi.getEnrolledClasses();
      setClasses(data);
      setError(null);
    } catch (err) {
      setError('Failed to load classes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async () => {
    if (!classCode.trim()) return;
    
    try {
      setJoinLoading(true);
      await studentApi.joinClass(classCode);
      await fetchClasses();
      setClassCode('');
      setError(null);
    } catch (err) {
      setError('Invalid class code or already enrolled');
    } finally {
      setJoinLoading(false);
    }
  };

  const handleLeaveClass = async () => {
    if (!selectedClass) return;
    
    try {
      await studentApi.leaveClass(selectedClass.id);
      await fetchClasses();
      setConfirmDialog(false);
      setSelectedClass(null);
    } catch (err) {
      setError('Failed to leave class');
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
      <Typography variant="h4" sx={{ mb: 4, color: 'white' }}>
        My Classes
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <ClassCodeInput>
        <TextField
          fullWidth
          placeholder="Enter class code"
          value={classCode}
          onChange={(e) => setClassCode(e.target.value)}
          disabled={joinLoading}
        />
        <Button
          variant="contained"
          onClick={handleJoinClass}
          disabled={joinLoading || !classCode.trim()}
          sx={{
            bgcolor: '#FFC600',
            color: '#000',
            '&:hover': { bgcolor: '#FFD700' }
          }}
        >
          {joinLoading ? <CircularProgress size={24} /> : 'Join Class'}
        </Button>
      </ClassCodeInput>

      <Grid container spacing={3}>
        {classes.map((classItem) => (
          <Grid item xs={12} sm={6} md={4} key={classItem.id}>
            <ClassCard>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="overline" sx={{ color: '#FFC600' }}>
                  {classItem.code}
                </Typography>
                <IconButton
                  onClick={(e) => {
                    setMenuAnchor(e.currentTarget);
                    setSelectedClass(classItem);
                  }}
                  sx={{ color: 'white' }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {classItem.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#999' }}>
                {classItem.teacher}
              </Typography>
            </ClassCard>
          </Grid>
        ))}
      </Grid>

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
          <Button onClick={() => setConfirmDialog(false)}>
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