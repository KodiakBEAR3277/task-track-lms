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
  styled
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';

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
            {enrolledClasses.map((class_) => (
              <MuiGrid item xs={12} sm={6} md={4} key={class_.id}>
                <ClassCard 
                  onClick={() => navigate(`/student/class/${class_.id}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <ClassCode>{class_.code}</ClassCode>
                    <IconButton size="small" sx={{ color: 'white' }}>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {class_.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#999', mb: 0.5 }}>
                    {class_.teacher}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    {class_.schedule}
                  </Typography>
                </ClassCard>
              </MuiGrid>
            ))}
          </MuiGrid>
        </MuiContainer>
      </MainContent>
    </Box>
  );
}

export default StudentDashboard; 