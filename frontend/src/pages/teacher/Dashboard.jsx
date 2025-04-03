import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateClassModal from '../../components/CreateClassModal';
import teacherApi from '../../services/teacherApi';

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
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await teacherApi.getClasses();
      setClasses(data);
      setError(null);
    } catch (err) {
      setError('Failed to load classes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (classData) => {
    try {
      const newClass = await teacherApi.createClass(classData);
      setClasses([...classes, newClass]);
      return newClass;
    } catch (err) {
      throw new Error(err.message || 'Failed to create class');
    }
  };

  const handleContextMenu = (event, class_) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedClass(class_);
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleMenuClick = (event, class_) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedClass(class_); // Set the selected class when opening menu
  };

  const handleEditClass = async (classData) => {
    try {
      const updatedClass = await teacherApi.updateClass(selectedClass.id, classData);
      setClasses(classes.map(c => c.id === updatedClass.id ? updatedClass : c));
      handleMenuClose();
    } catch (err) {
      setError('Failed to update class');
    }
  };

  const handleDeleteClass = async () => {
    if (!selectedClass) {
      console.error('No class selected for deletion');
      return;
    }
  
    try {
      await teacherApi.deleteClass(selectedClass.id);
      
      // Update UI after successful deletion
      setClasses(prevClasses => prevClasses.filter(c => c.id !== selectedClass.id));
      setDeleteDialogOpen(false);
      setSelectedClass(null);
      setMenuAnchor(null);
    } catch (err) {
      console.error('Failed to delete class:', err);
      setError('Failed to delete class. Please try again.');
    }
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setContextMenu(null);
    setSelectedClass(null);
  };

  const handleClassClick = (class_) => {
    navigate(`/teacher/class/${class_.id}`);
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ color: 'white' }}>
          Classes
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateModalOpen(true)}
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

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

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
        anchorPosition={contextMenu !== null ? {
          top: contextMenu.mouseY,
          left: contextMenu.mouseX
        } : undefined}
        PaperProps={{
          sx: { backgroundColor: '#333333', color: 'white' }
        }}
      >
        <MenuItem onClick={() => handleClassClick(selectedClass)}>
          <ListItemIcon sx={{ color: 'white' }}>
            <OpenInNewIcon fontSize="small" />
          </ListItemIcon>
          Open Class
        </MenuItem>
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon sx={{ color: '#FFC600' }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit Class
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: '#FF4444' }}>
          <ListItemIcon sx={{ color: '#FF4444' }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete Class
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedClass(null); // Clear selection on close
        }}
        PaperProps={{
          sx: { bgcolor: '#222222', color: 'white' }
        }}
      >
        <DialogTitle>Delete Class</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedClass?.name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setDeleteDialogOpen(false);
              setSelectedClass(null);
            }}
            sx={{ color: '#999' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteClass}
            sx={{ 
              bgcolor: '#FF4444',
              color: 'white',
              '&:hover': { bgcolor: '#FF6666' }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Regular Menu (Three Dots) */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { bgcolor: '#333333' }
        }}
      >
        <MenuItem 
          onClick={() => {
            handleDeleteClick();
          }}
          sx={{ color: '#FF4444' }}
        >
          Delete Class
        </MenuItem>
      </Menu>

      {/* Create Class Modal */}
      <CreateClassModal 
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateClass}
      />
    </Box>
  );
}

export default TeacherDashboard;