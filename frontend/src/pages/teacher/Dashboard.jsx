import {
  Box,
  Container as MuiContainer,
  Grid as MuiGrid,
  Typography,
  Card,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Menu,
  MenuItem,
  styled
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import CreateClassModal from '../../components/CreateClassModal';

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

const ClassCard = styled(Card)({
  backgroundColor: '#222222',
  padding: '24px',
  borderRadius: '8px',
  height: '100%',
  '&:hover': {
    backgroundColor: '#2a2a2a',
  },
});

const ClassCode = styled(Typography)({
  backgroundColor: '#333333',
  color: '#FFC600',
  padding: '4px 8px',
  borderRadius: '4px',
  display: 'inline-block',
  fontSize: '0.875rem',
  fontWeight: 500,
});

const CreateClassButton = styled(Button)({
  backgroundColor: 'rgba(255, 198, 0, 0.1)',
  color: '#FFC600',
  border: '2px dashed #FFC600',
  borderRadius: '8px',
  padding: '32px',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  '&:hover': {
    backgroundColor: 'rgba(255, 198, 0, 0.2)',
  },
});

function TeacherDashboard() {
  const navigate = useNavigate();
  const [contextMenu, setContextMenu] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  
  const [classes, setClasses] = useState([
    {
      id: 1,
      code: 'IT212-2A',
      name: 'IT 212 OBJECT-ORIENTED PROGRAMMING',
      schedule: '2A-1 | TTH 9:30AM-12:00NN EB 309',
      students: 35
    },
    // Add more classes as needed
  ]);

  const handleContextMenu = (event, class_) => {
    event.preventDefault();
    setSelectedClass(class_);
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null,
    );
  };

  const handleMenuClick = (event, class_) => {
    event.stopPropagation();
    setSelectedClass(class_);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setContextMenu(null);
    setSelectedClass(null);
  };

  const handleCreateClass = () => {
    // Add class creation logic here
    console.log('Creating new class...');
  };

  const handleClassClick = (class_) => {
    console.log('Navigating to class:', class_.id);
    navigate(`/teacher/classes/${class_.id}`);
  };

  const handleDeleteClass = () => {
    // Add delete logic here
    console.log('Deleting class:', selectedClass);
    handleMenuClose();
  };

  const handleEditClass = () => {
    // Add edit logic here
    console.log('Editing class:', selectedClass);
    handleMenuClose();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledDrawer variant="permanent">
        <List sx={{ marginTop: '2rem' }}>
          <ListItem 
            button 
            selected
            onClick={() => navigate('/teacher/dashboard')}
          >
            <ListItemIcon sx={{ color: '#FFC600' }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem 
            button
            onClick={() => navigate('/teacher/schedule')}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              <CalendarMonthIcon />
            </ListItemIcon>
            <ListItemText primary="Schedule" />
          </ListItem>
        </List>
      </StyledDrawer>

      <MainContent>
        <MuiContainer>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ color: 'white', mb: 3 }}>
              Classes
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsCreateClassOpen(true)}
              sx={{
                backgroundColor: '#FFC600',
                color: 'black',
                '&:hover': {
                  backgroundColor: '#FFD700',
                },
              }}
            >
              Create Class
            </Button>
          </Box>

          <MuiGrid container spacing={3}>
            {classes.map((class_) => (
              <MuiGrid item xs={12} sm={6} md={4} key={class_.id}>
                <ClassCard 
                  onClick={() => handleClassClick(class_)}
                  onContextMenu={(e) => handleContextMenu(e, class_)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <ClassCode>{class_.code}</ClassCode>
                    <IconButton 
                      size="small" 
                      sx={{ color: 'white' }}
                      onClick={(e) => handleMenuClick(e, class_)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1, color: 'white' }}>
                    {class_.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    {class_.schedule}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#999', mt: 2 }}>
                    {class_.students} Students
                  </Typography>
                </ClassCard>
              </MuiGrid>
            ))}
          </MuiGrid>
        </MuiContainer>
      </MainContent>

      {/* Context Menu (Right Click) */}
      <Menu
        open={contextMenu !== null}
        onClose={handleMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => handleClassClick(selectedClass)}>
          Open Class
        </MenuItem>
        <MenuItem onClick={handleEditClass}>
          Edit Class
        </MenuItem>
        <MenuItem onClick={handleDeleteClass} sx={{ color: 'error.main' }}>
          Delete Class
        </MenuItem>
      </Menu>

      {/* Regular Menu (Three Dots) */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleClassClick(selectedClass)}>
          Open Class
        </MenuItem>
        <MenuItem onClick={handleEditClass}>
          Edit Class
        </MenuItem>
        <MenuItem onClick={handleDeleteClass} sx={{ color: 'error.main' }}>
          Delete Class
        </MenuItem>
      </Menu>

      {/* Create Class Modal */}
      <CreateClassModal
        open={isCreateClassOpen}
        onClose={() => setIsCreateClassOpen(false)}
      />
    </Box>
  );
}

export default TeacherDashboard; 