import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  IconButton,
  Menu,
  MenuItem,
  Button,
  styled
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import CreateClassModal from '../../components/CreateClassModal';

// Styled components
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

function TeacherDashboard() {
  const navigate = useNavigate();
  const [contextMenu, setContextMenu] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  
  const [classes] = useState([
    {
      id: 1,
      code: 'IT212-2A',
      name: 'IT 212 OBJECT-ORIENTED PROGRAMMING',
      schedule: '2A-1 | TTH 9:30AM-12:00NN EB 309',
      students: 35
    },
  ]);

  const handleContextMenu = (event, class_) => {
    event.preventDefault();
    setSelectedClass(class_);
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4
    });
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

  const handleClassClick = (class_) => {
    navigate(`/teacher/class/${class_.id}`);
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ color: 'white' }}>
          Classes
        </Typography>
        
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

      <Grid container spacing={3}>
        {classes.map((class_) => (
          <Grid item xs={12} sm={6} md={4} key={class_.id}>
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
          </Grid>
        ))}
      </Grid>

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
        PaperProps={{
          sx: { backgroundColor: '#333333', color: 'white' }
        }}
      >
        <MenuItem onClick={() => handleClassClick(selectedClass)}>
          Open Class
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          Edit Class
        </MenuItem>
        <MenuItem sx={{ color: '#FF4444' }} onClick={handleMenuClose}>
          Delete Class
        </MenuItem>
      </Menu>

      {/* Regular Menu (Three Dots) */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { backgroundColor: '#333333', color: 'white' }
        }}
      >
        <MenuItem onClick={() => handleClassClick(selectedClass)}>
          Open Class
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          Edit Class
        </MenuItem>
        <MenuItem sx={{ color: '#FF4444' }} onClick={handleMenuClose}>
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