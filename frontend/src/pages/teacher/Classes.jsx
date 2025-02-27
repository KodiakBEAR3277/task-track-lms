import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  IconButton,
  styled,
  Avatar,
  Grid,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import FolderIcon from '@mui/icons-material/Folder';
import dayjs from 'dayjs';
import AddResourceModal from '../../components/AddResourceModal';
import ResourceView from '../../components/ResourceView';

// Add the missing styled components
const ClassHeader = styled(Box)({
  backgroundColor: '#222222',
  padding: '2rem',
  color: 'white',
});

const StyledTabs = styled(Tabs)({ 
  backgroundColor: '#333333',
  '& .MuiTab-root': {
    color: 'white',
    '&.Mui-selected': {
      color: '#FFC600',
    }
  },
  '& .MuiTabs-indicator': {
    backgroundColor: '#FFC600',
  }
});

const ActivityItem = styled(ListItem)({
  backgroundColor: '#222222',
  margin: '8px 0',
  padding: '16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: '#2a2a2a',
  }
});

const StudentItem = styled(ListItem)({
  backgroundColor: '#222222',
  margin: '8px 0',
  padding: '16px',
  borderRadius: '8px',
  display: 'flex',
  justifyContent: 'space-between',
  '&:hover': {
    backgroundColor: '#2a2a2a',
  }
});

const CalendarGrid = styled(Box)({
  backgroundColor: '#222222',
  borderRadius: '8px',
  overflow: 'hidden',
  '& .calendar-header': {
    padding: '1rem',
    borderBottom: '1px solid #333',
  },
  '& .calendar-body': {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '1px',
    backgroundColor: '#333',
  },
  '& .calendar-day': {
    backgroundColor: '#222222',
    padding: '0.5rem',
    minHeight: '100px',
    '&.today': {
      backgroundColor: 'rgba(255, 198, 0, 0.1)',
    },
    '&.different-month': {
      opacity: 0.5,
    }
  }
});

const TabPanel = ({ children, value, index }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    sx={{ 
      backgroundColor: '#111111',
      minHeight: 'calc(100vh - 200px)',
      p: 3 
    }}
  >
    {value === index && children}
  </Box>
);

const SidebarDrawer = styled(Box)({
  width: '300px',
  backgroundColor: '#222222',
  borderRight: '1px solid #333333',
  height: '100%',
  overflowY: 'auto',
});

const ModuleContainer = styled(Box)({
  backgroundColor: '#333333',
  margin: '8px',
  borderRadius: '8px',
  overflow: 'hidden',
});

const ModuleHeader = styled(Box)({
  padding: '12px 16px',
  backgroundColor: '#444444',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const ResourceButton = styled(Button)({
  width: '100%',
  justifyContent: 'flex-start',
  padding: '8px 16px',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(255, 198, 0, 0.1)',
  },
});

const AddResourceDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    backgroundColor: '#222222',
    color: 'white',
    minWidth: '400px',
  },
});

const ResourceOption = styled(Button)({
  width: '100%',
  justifyContent: 'flex-start',
  padding: '16px',
  margin: '8px 0',
  backgroundColor: '#333333',
  color: 'white',
  '&:hover': {
    backgroundColor: '#444444',
  },
  '& .MuiButton-startIcon': {
    marginRight: '16px',
  },
});

function TeacherClasses() {
  const { id } = useParams();
  const [currentTab, setCurrentTab] = useState(0);
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [selectedResourceType, setSelectedResourceType] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  const [modules, setModules] = useState([
    {
      id: 1,
      title: 'Module 1: Introduction',
      resources: [
        {
          id: 1,
          type: 'lesson',
          title: 'Introduction to the Course',
          description: 'Overview of what we will learn in this course.',
          deadline: 'No deadline'
        },
        {
          id: 2,
          type: 'task',
          title: 'First Assignment',
          description: 'Submit your first assignment here.',
          deadline: '2024-03-01 23:59'
        }
      ]
    },
  ]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleAddModule = () => {
    const newModule = {
      id: modules.length + 1,
      title: `Module ${modules.length + 1}`,
      resources: []
    };
    setModules([...modules, newModule]);
  };

  const handleAddResource = (moduleId) => {
    setSelectedModule(moduleId);
    setIsAddResourceOpen(true);
  };

  const handleResourceTypeSelect = (type) => {
    setSelectedResourceType(type);
  };

  const handleResourceClick = (resource) => {
    setSelectedResource(resource);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <ClassHeader>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography variant="h4">IT 212 OBJECT-ORIENTED PROGRAMMING</Typography>
            <Typography variant="subtitle1">2A-1 | TTH 9:30AM-12:00NN EB 309</Typography>
          </div>
          <IconButton sx={{ color: 'white' }}>
            <EditIcon />
          </IconButton>
        </Box>
      </ClassHeader>

      <StyledTabs value={currentTab} onChange={handleTabChange}>
        <Tab icon={<GridViewIcon />} label="Activities" />
        <Tab icon={<PeopleIcon />} label="People" />
        <Tab icon={<CalendarMonthIcon />} label="Calendar" />
      </StyledTabs>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar - Only show in Activities tab */}
        {currentTab === 0 && (
          <SidebarDrawer>
            <Box sx={{ p: 2 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddModule}
                sx={{
                  backgroundColor: '#FFC600',
                  '&:hover': { backgroundColor: '#e3b200' }
                }}
              >
                Add Module
              </Button>
            </Box>

            {modules.map((module) => (
              <ModuleContainer key={module.id}>
                <ModuleHeader>
                  <Typography variant="subtitle1">{module.title}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleAddResource(module.id)}
                    sx={{ color: 'white' }}
                  >
                    <AddIcon />
                  </IconButton>
                </ModuleHeader>
                <Box>
                  {module.resources.map((resource) => (
                    <ResourceButton key={resource.id}>
                      {resource.title}
                    </ResourceButton>
                  ))}
                </Box>
              </ModuleContainer>
            ))}
          </SidebarDrawer>
        )}

        {/* Main content area */}
        <Box 
          sx={{ 
            flex: 1, 
            backgroundColor: '#111111', 
            p: 3,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#111111',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#333333',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#444444',
              },
            },
          }}
        >
          <TabPanel value={currentTab} index={0}>
            <Box sx={{ mb: 3 }}>
              {modules.map((module) => (
                <Box
                  key={module.id}
                  sx={{
                    backgroundColor: '#222222',
                    borderRadius: 1,
                    mb: 2,
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      backgroundColor: '#333333'
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white' }}>
                      {module.title}
                    </Typography>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setSelectedModule(module.id);
                        setIsAddResourceOpen(true);
                      }}
                      sx={{
                        color: '#FFC600',
                        '&:hover': { backgroundColor: 'rgba(255, 198, 0, 0.08)' }
                      }}
                    >
                      Add Resource
                    </Button>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    {module.resources.map((resource) => (
                      <Button
                        key={resource.id}
                        fullWidth
                        onClick={() => handleResourceClick(resource)}
                        sx={{
                          justifyContent: 'flex-start',
                          textAlign: 'left',
                          mb: 1,
                          p: 2,
                          backgroundColor: '#333333',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#444444'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          {resource.type === 'lesson' && <ArticleIcon sx={{ mr: 2 }} />}
                          {resource.type === 'task' && <AssignmentIcon sx={{ mr: 2 }} />}
                          {resource.type === 'quiz' && <QuizIcon sx={{ mr: 2 }} />}
                          {resource.type === 'resource' && <FolderIcon sx={{ mr: 2 }} />}
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1">
                              {resource.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#999999' }}>
                              {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)} • Due: {resource.deadline}
                            </Typography>
                          </Box>
                        </Box>
                      </Button>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            {/* People tab content */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
              <Typography variant="h6" sx={{ color: '#FFC600' }}>
                Students
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                sx={{ 
                  backgroundColor: '#FFC600',
                  '&:hover': { backgroundColor: '#e3b200' }
                }}
              >
                Add Student
              </Button>
            </Box>
            <List>
              {/* Student items */}
            </List>
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            {/* Calendar tab content */}
            <CalendarGrid>
              {/* Calendar implementation */}
            </CalendarGrid>
          </TabPanel>
        </Box>
      </Box>

      {/* Add Resource Dialog */}
      <AddResourceDialog
        open={isAddResourceOpen && !selectedResourceType}
        onClose={() => {
          setIsAddResourceOpen(false);
          setSelectedResourceType(null);
        }}
      >
        <DialogTitle>Add Resource</DialogTitle>
        <DialogContent>
          <ResourceOption
            startIcon={<ArticleIcon />}
            onClick={() => handleResourceTypeSelect('lesson')}
          >
            Lesson
          </ResourceOption>
          <ResourceOption
            startIcon={<AssignmentIcon />}
            onClick={() => handleResourceTypeSelect('task')}
          >
            Task
          </ResourceOption>
          <ResourceOption
            startIcon={<QuizIcon />}
            onClick={() => handleResourceTypeSelect('quiz')}
          >
            Quiz
          </ResourceOption>
          <ResourceOption
            startIcon={<FolderIcon />}
            onClick={() => handleResourceTypeSelect('resource')}
          >
            Resource
          </ResourceOption>
        </DialogContent>
      </AddResourceDialog>

      {/* Add Resource Modal */}
      <AddResourceModal
        open={isAddResourceOpen && selectedResourceType !== null}
        onClose={() => {
          setIsAddResourceOpen(false);
          setSelectedResourceType(null);
        }}
        resourceType={selectedResourceType}
      />

      {selectedResource && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '50%',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            boxShadow: '-4px 0 15px rgba(0, 0, 0, 0.3)',
            transform: selectedResource ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s ease-in-out',
            zIndex: 1200,
            overflow: 'auto'
          }}
        >
          <ResourceView
            resource={selectedResource}
            onClose={() => setSelectedResource(null)}
          />
        </Box>
      )}
    </Box>
  );
}

export default TeacherClasses;