import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit'; // Fixed typo
import DeleteIcon from '@mui/icons-material/Delete'; // Fixed typo
import LinkIcon from '@mui/icons-material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import teacherApi from '../../services/teacherApi';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: '#222222',
  '& .MuiTab-root': {
    color: 'white',
    '&.Mui-selected': {
      color: '#FFC600',
    }
  },
  '& .MuiTabs-indicator': {
    backgroundColor: '#FFC600',
  }
}));

const ModuleItem = styled(Paper)(({ theme }) => ({
  backgroundColor: '#222222',
  color: 'white',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '&:hover': {
    backgroundColor: '#2a2a2a',
  }
}));

const ModuleContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#222222',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2)
}));

const ContentArea = styled(Box)(({ theme }) => ({
  backgroundColor: '#222222',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  minHeight: 400
}));

const ContentListItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: '#2a2a2a',
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: '#333333',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(255, 198, 0, 0.15)',
    '&:hover': {
      backgroundColor: 'rgba(255, 198, 0, 0.25)',
    }
  }
}));

const AddModuleDialog = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({ title, description });
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{ sx: { bgcolor: '#222222', color: 'white' } }}
    >
      <DialogTitle>Add Module</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Module Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            },
            '& .MuiInputLabel-root': { color: '#999' }
          }}
        />
        <TextField
          margin="dense"
          label="Description (Optional)"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            },
            '& .MuiInputLabel-root': { color: '#999' }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: '#999' }}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          sx={{ 
            bgcolor: '#FFC600',
            color: 'black',
            '&:hover': {
              bgcolor: '#FFD700',
            }
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AddContentDialog = ({ open, onClose, onSubmit, moduleId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('material'); // Default to material
  const [dueDate, setDueDate] = useState('');
  const [points, setPoints] = useState('100');
  const [linkUrl, setLinkUrl] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({
      moduleId,
      title,
      description,
      type,
      dueDate: type === 'task' ? dueDate : null,
      points: type === 'task' ? parseInt(points) : null,
      linkUrl: linkUrl.trim()
    });
    setTitle('');
    setDescription('');
    setType('material');
    setDueDate('');
    setPoints('100');
    setLinkUrl('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { bgcolor: '#222222', color: 'white' } }}
    >
      <DialogTitle>Add Content</DialogTitle>
      <DialogContent>
        <TextField
          select
          margin="dense"
          label="Content Type"
          fullWidth
          value={type}
          onChange={(e) => setType(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            },
            '& .MuiInputLabel-root': { color: '#999' }
          }}
        >
          <MenuItem value="material">Learning Material</MenuItem>
          <MenuItem value="task">Performance Task</MenuItem>
          <MenuItem value="quiz">Quiz</MenuItem>
        </TextField>

        <TextField
          margin="dense"
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            },
            '& .MuiInputLabel-root': { color: '#999' }
          }}
        />

        <TextField
          margin="dense"
          label={`${type === 'material' ? 'Content Link (Google Drive, etc.)' : 
                   type === 'task' ? 'Task Link (Google Forms, etc.)' : 
                   'Quiz Link'}`}
          fullWidth
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            },
            '& .MuiInputLabel-root': { color: '#999' }
          }}
        />

        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            },
            '& .MuiInputLabel-root': { color: '#999' }
          }}
        />

        {type === 'task' && (
          <>
            <TextField
              margin="dense"
              label="Due Date"
              type="datetime-local"
              fullWidth
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                },
                '& .MuiInputLabel-root': { color: '#999' }
              }}
            />
            <TextField
              margin="dense"
              label="Points"
              type="number"
              fullWidth
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              InputProps={{ inputProps: { min: 0 } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                },
                '& .MuiInputLabel-root': { color: '#999' }
              }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: '#999' }}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          sx={{ 
            bgcolor: '#FFC600',
            color: 'black',
            '&:hover': {
              bgcolor: '#FFD700',
            }
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ActivitiesTab = ({ 
  classId, 
  modules, 
  setModules, 
  onModuleAdd, 
  onContentAdd, 
  onModuleDelete 
}) => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [isEditContentOpen, setIsEditContentOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const DeleteContentDialog = ({ open, onClose, onConfirm, error }) => (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{ sx: { bgcolor: '#222222', color: 'white' } }}
    >
      <DialogTitle>Delete Content</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography>
          Are you sure you want to delete this content? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: '#999' }}>Cancel</Button>
        <Button 
          onClick={onConfirm}
          sx={{ bgcolor: '#FF4444', color: 'white', '&:hover': { bgcolor: '#FF6666' } }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ display: 'flex', gap: 3 }}>
      {/* Modules Sidebar */}
      <Box sx={{ width: 320, flexShrink: 0 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: 'white' }}>Modules</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setIsAddModuleOpen(true)}
            sx={{
              bgcolor: '#FFC600',
              color: 'black',
              '&:hover': { bgcolor: '#FFD700' }
            }}
          >
            Add Module
          </Button>
        </Box>

        {modules?.map((module) => (
          <ModuleContainer key={module.id}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 500 }}>
                {module.title}
              </Typography>
              <Box>
                <IconButton
                  size="small"
                  onClick={() => {
                    setSelectedModule(module);
                    setIsAddContentOpen(true);
                  }}
                  sx={{ 
                    color: 'black',
                    bgcolor: '#FFC600',
                    mr: 1,
                    '&:hover': { bgcolor: '#FFD700' }
                  }}
                >
                  <AddIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onModuleDelete(module.id)}
                  sx={{ 
                    color: 'white',
                    bgcolor: '#FF4444',
                    '&:hover': { bgcolor: '#FF6666' }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>

            <List sx={{ py: 0 }}>
              {module.contents?.map((content) => (
                <ContentListItem
                  key={content.id}
                  button
                  selected={selectedContent?.id === content.id}
                  onClick={() => setSelectedContent(content)}
                >
                  <ListItemText
                    primary={content.title}
                    secondary={
                      <Typography variant="body2" sx={{ color: '#999' }}>
                        {content.type === 'task' ? '📝 Performance Task' :
                         content.type === 'material' ? '📚 Learning Material' : '📋 Quiz'}
                        {content.type === 'task' && content.due_date && 
                          ` • Due: ${new Date(content.due_date).toLocaleDateString()}`}
                      </Typography>
                    }
                    sx={{
                      '& .MuiListItemText-primary': { color: 'white' }
                    }}
                  />
                </ContentListItem>
              ))}
            </List>
          </ModuleContainer>
        ))}
      </Box>

      {/* Content Area */}
      <Box sx={{ flex: 1 }}>
        {selectedContent ? (
          <ContentArea>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: 'white' }}>
                {selectedContent.title}
              </Typography>
              <Box>
                <IconButton 
                  onClick={() => setIsEditContentOpen(true)}
                  sx={{ color: 'white', mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  sx={{ color: '#FF4444' }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>

            <Typography sx={{ color: '#999', mb: 3 }}>
              {selectedContent.description}
            </Typography>

            {/* Content type specific UI */}
            {selectedContent.type === 'task' && (
              <Box>
                <Typography variant="subtitle1" sx={{ color: 'white', mb: 2 }}>
                  Due Date: {new Date(selectedContent.due_date).toLocaleString()}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'white', mb: 2 }}>
                  Points: {selectedContent.points}
                </Typography>
                {selectedContent.link_url && (
                  <Button
                    startIcon={<OpenInNewIcon />}
                    href={selectedContent.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      bgcolor: '#FFC600',
                      color: 'black',
                      '&:hover': { bgcolor: '#FFD700' }
                    }}
                  >
                    Open Task
                  </Button>
                )}
              </Box>
            )}

            {selectedContent.type === 'material' && selectedContent.link_url && (
              <Button
                startIcon={<OpenInNewIcon />}
                href={selectedContent.link_url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  bgcolor: '#FFC600',
                  color: 'black',
                  '&:hover': { bgcolor: '#FFD700' }
                }}
              >
                Open Material
              </Button>
            )}
          </ContentArea>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: 400,
            color: '#666',
            bgcolor: '#222222',
            borderRadius: 1
          }}>
            Select a content item to view details
          </Box>
        )}
        <DeleteContentDialog 
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={async () => {
            try {
              await teacherApi.deleteModuleContent(classId, selectedContent.module_id, selectedContent.id);
              const updatedModules = modules.map(module => ({
                ...module,
                contents: module.contents.filter(c => c.id !== selectedContent.id)
              }));
              setModules(updatedModules);
              setSelectedContent(null);
              setIsDeleteDialogOpen(false);
            } catch (err) {
              console.error('Failed to delete content:', err);
            }
          }}
        />
      </Box>
      <AddModuleDialog
        open={isAddModuleOpen}
        onClose={() => setIsAddModuleOpen(false)}
        onSubmit={onModuleAdd}
      />
      <AddContentDialog
        open={isAddContentOpen}
        onClose={() => setIsAddContentOpen(false)}
        onSubmit={onContentAdd}
        moduleId={selectedModule?.id}
      />
    </Box>
  );
};

const StudentsTab = ({ students }) => {
  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        backgroundColor: '#222222',
        '& .MuiTableCell-root': {
          color: 'white',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Enrolled Date</TableCell>
            <TableCell>Grade</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students?.map((student) => (
            <TableRow 
              key={student.id}
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)' 
                } 
              }}
            >
              <TableCell>{student.username}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>
                <Box
                  sx={{
                    backgroundColor: student.status === 'active' ? '#4CAF50' : '#FF9800',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    display: 'inline-block'
                  }}
                >
                  {student.status}
                </Box>
              </TableCell>
              <TableCell>
                {new Date(student.enrolled_at).toLocaleDateString()}
              </TableCell>
              <TableCell>{student.grade || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

function TeacherClassView() {
  const { id } = useParams();
  const [tab, setTab] = useState(0);
  const [classData, setClassData] = useState(null);
  const [modules, setModules] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch class details first
        const classDetails = await teacherApi.getClassDetails(id);
        setClassData(classDetails);

        // Then fetch students and modules
        try {
          const [classStudents, classModules] = await Promise.all([
            teacherApi.getClassStudents(id),
            teacherApi.getClassModules(id)
          ]);

          // For each module, fetch its contents
          const modulesWithContents = await Promise.all(
            classModules.map(async (module) => {
              const contents = await teacherApi.getModuleContents(id, module.id);
              return { ...module, contents };
            })
          );

          setStudents(classStudents || []);
          setModules(modulesWithContents || []);
        } catch (secondaryError) {
          console.error('Error fetching secondary data:', secondaryError);
        }

      } catch (err) {
        console.error('Error fetching class data:', err);
        setError(err.message || 'Failed to load class details');
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [id]);

  const handleModuleAdd = async (moduleData) => {
    try {
      const newModule = await teacherApi.createModule(id, moduleData);
      setModules([...modules, newModule]);
    } catch (err) {
      console.error('Failed to create module:', err);
      setError('Failed to create module');
    }
  };

  const handleContentAdd = async (contentData) => {
    try {
      const newContent = await teacherApi.createModuleContent(
        id,
        contentData.moduleId,
        contentData
      );
      
      // Update the modules list with new content
      const updatedModules = modules.map(module => {
        if (module.id === contentData.moduleId) {
          return {
            ...module,
            contents: [...(module.contents || []), newContent]
          };
        }
        return module;
      });
      
      setModules(updatedModules);
    } catch (err) {
      console.error('Failed to create content:', err);
      setError('Failed to create content');
    }
  };

  const handleDeleteModule = async (moduleId) => {
    try {
      await teacherApi.deleteModule(id, moduleId);
      setModules(prevModules => prevModules.filter(m => m.id !== moduleId));
    } catch (err) {
      console.error('Failed to delete module:', err);
      setError('Failed to delete module');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ bgcolor: '#222222', p: 3, mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'white' }}>
          {classData?.name}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#999' }}>
          Class Code: {classData?.code}
        </Typography>
        <Typography variant="body2" sx={{ color: '#999', mt: 1 }}>
          {classData?.schedule}
        </Typography>
      </Box>

      {/* Tabs */}
      <StyledTabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
        <Tab label="Activities" />
        <Tab label="Students" />
      </StyledTabs>

      {/* Tab Content */}
      <Box sx={{ mt: 3 }}>
        {tab === 0 && (
          <ActivitiesTab 
            classId={id}
            modules={modules}
            setModules={setModules}
            onModuleAdd={handleModuleAdd}
            onContentAdd={handleContentAdd}
            onModuleDelete={handleDeleteModule}
          />
        )}
        {tab === 1 && (
          <StudentsTab students={students} />
        )}
      </Box>
    </Box>
  );
}

export default TeacherClassView;