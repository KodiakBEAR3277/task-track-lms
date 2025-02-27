import {
  Box,
  Container as MuiContainer,
  Grid as MuiGrid,
  Typography,
  Card,
  TextField,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: '#222222',
    color: 'white',
  },
});

const MainContent = styled(Box)({
  flexGrow: 1,
  padding: '32px',
  backgroundColor: '#111111',
  minHeight: '100vh',
  '& .MuiContainer-root': {
    paddingLeft: 0,
    paddingRight: 0,
    marginLeft: 0,
    marginRight: 0,
    maxWidth: 'none'
  }
});

const ClassCodeInput = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'white',
    borderRadius: '8px',
    '& input': {
      color: '#000000',
    },
    '& fieldset': {
      borderColor: '#ddd',
    },
    '&:hover fieldset': {
      borderColor: '#FFC600',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FFC600',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666',
    backgroundColor: 'white',
    padding: '0 4px',
    '&.Mui-focused': {
      color: '#FFC600',
    },
  },
});

const ClassCard = styled(Card)({
  backgroundColor: '#222222',
  color: 'white',
  padding: '1.5rem',
  borderRadius: '12px',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
});

const ClassCode = styled(Typography)({
  color: '#FFC600',
  fontWeight: 'bold',
  fontSize: '0.875rem',
});

function StudentDashboard() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleMenuClick = (event, classItem) => {
    event.stopPropagation(); // Prevent the card click event
    setAnchorEl(event.currentTarget);
    setSelectedClass(classItem);
  };

  const handleMenuClose = (event) => {
    event.stopPropagation(); // Prevent the card click event
    setAnchorEl(null);
  };

  const handleLeaveClass = (event) => {
    event.stopPropagation(); // Prevent the card click event
    setAnchorEl(null);
    setOpenConfirmDialog(true);
  };

  const handleConfirmLeave = () => {
    // Here you would handle the API call to leave the class
    console.log('Leaving class:', selectedClass);
    setOpenConfirmDialog(false);
    // After successful API call, you might want to refresh the classes list
  };

  const handleCardClick = (classId) => {
    navigate(`/student/class/${classId}`);
  };

  // Mock data - will be replaced with real data later
  const enrolledClasses = [
    { id: 1, code: 'GKO8BS', name: 'Data Structures and Algorithms', teacher: 'Dr. Smith', schedule: 'MW 9:30-12:00' },
    { id: 2, code: 'CT2OKY', name: 'Object-Oriented Programming', teacher: 'Prof. Johnson', schedule: 'TTH 9:30-12:00' },
    { id: 3, code: 'WWDQ4F', name: 'Human-Computer Interaction', teacher: 'Mrs. Davis', schedule: 'MW 13:00-15:30' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledDrawer variant="permanent">
        <List sx={{ marginTop: '2rem' }}>
          <ListItem 
            button 
            selected 
            onClick={() => navigate('/student/dashboard')}
          >
            <ListItemIcon sx={{ color: '#FFC600' }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem 
            button
            onClick={() => navigate('/student/calendar')}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              <CalendarMonthIcon />
            </ListItemIcon>
            <ListItemText primary="Calendar" />
          </ListItem>
        </List>
      </StyledDrawer>

      <MainContent>
        <MuiContainer>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ color: 'white', mb: 3 }}>
              Classes
            </Typography>
            <ClassCodeInput
              fullWidth
              label="Enter Class Code"
              variant="outlined"
              placeholder="Enter the code provided by your teacher"
              sx={{ maxWidth: 400 }}
            />
          </Box>

          <MuiGrid container spacing={3}>
            {enrolledClasses.map((classItem) => (
              <MuiGrid item xs={12} sm={6} md={4} key={classItem.id}>
                <ClassCard 
                  onClick={() => handleCardClick(classItem.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <ClassCode>{classItem.code}</ClassCode>
                    <IconButton
                      onClick={(e) => handleMenuClick(e, classItem)}
                      sx={{ color: 'white', '&:hover': { color: '#FFC600' } }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {classItem.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#999', mb: 0.5 }}>
                    {classItem.teacher}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    {classItem.schedule}
                  </Typography>
                </ClassCard>
              </MuiGrid>
            ))}
          </MuiGrid>
        </MuiContainer>
      </MainContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: '#333333',
            color: 'white',
            '& .MuiMenuItem-root': {
              '&:hover': {
                backgroundColor: '#444444',
              },
            },
          },
        }}
      >
        <MenuItem onClick={handleLeaveClass}>
          <Typography sx={{ color: '#FF4444' }}>Leave Class</Typography>
        </MenuItem>
      </Menu>

      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#222222',
            color: 'white',
          },
        }}
      >
        <DialogTitle>Leave Class</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to leave {selectedClass?.name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenConfirmDialog(false)}
            sx={{ color: '#999999' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmLeave}
            sx={{ 
              color: 'white',
              backgroundColor: '#FF4444',
              '&:hover': {
                backgroundColor: '#FF6666',
              },
            }}
          >
            Leave Class
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default StudentDashboard; 