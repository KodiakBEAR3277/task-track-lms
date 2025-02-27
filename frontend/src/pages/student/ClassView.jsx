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
  Paper,
  Button
} from '@mui/material';
import { DateCalendar, PickersDay } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import GridViewIcon from '@mui/icons-material/GridView';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import FolderIcon from '@mui/icons-material/Folder';
import dayjs from 'dayjs';
import StudentResourceView from '../../components/StudentResourceView';

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

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ padding: '24px' }}>
    {value === index && children}
  </div>
);

const TimelineContainer = styled(Box)({
  marginTop: '2rem',
  padding: '1.5rem',
  backgroundColor: '#222222',
  borderRadius: '8px',
  '& .timeline-header': {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
  }
});

const TimelineItem = styled(Box)({
  position: 'relative',
  padding: '1rem 1.5rem',
  backgroundColor: 'rgba(255, 198, 0, 0.1)',
  borderLeft: '3px solid #FFC600',
  marginBottom: '1rem',
  borderRadius: '0 8px 8px 0',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateX(5px)',
    backgroundColor: 'rgba(255, 198, 0, 0.15)',
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

const CalendarEvent = styled(Box)({
  backgroundColor: 'rgba(255, 198, 0, 0.2)',
  border: '1px solid #FFC600',
  borderRadius: '4px',
  padding: '4px 8px',
  fontSize: '0.75rem',
  color: '#FFC600',
  marginBottom: '4px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  '&:hover': {
    backgroundColor: 'rgba(255, 198, 0, 0.3)',
  }
});

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

function ClassView() {
  const { id } = useParams();
  const [currentTab, setCurrentTab] = useState(0);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedResource, setSelectedResource] = useState(null);

  console.log('Class ID:', id);

  // Mock timeline data
  const timelineEvents = [
    {
      id: 1,
      title: 'M1LAB1: Basic Java Program',
      type: 'Laboratory',
      startDate: 'Aug 21, 2024',
      dueDate: 'Aug 30, 2024',
      status: 'ongoing'
    },
    {
      id: 2,
      title: 'Performance Task 1: Java Application',
      type: 'Project',
      startDate: 'Aug 25, 2024',
      dueDate: 'Sep 15, 2024',
      status: 'upcoming'
    }
  ];

  // Mock data for lessons and events
  const events = [
    {
      id: 1,
      title: 'Module 2 - Java Operators, Strings, Math class',
      startDate: '2024-09-02',
      endDate: '2024-09-13',
      type: 'module'
    },
    {
      id: 2,
      title: 'L1. Typecasting and Operators',
      startDate: '2024-09-13',
      endDate: '2024-09-13',
      type: 'lesson'
    },
    // Add more events as needed
  ];

  // Mock modules data (similar to TeacherClasses)
  const [modules] = useState([
    {
      id: 1,
      title: 'Module 1: Introduction',
      resources: [
        {
          id: 1,
          type: 'lesson',
          title: 'Introduction to the Course',
          description: 'Overview of what we will learn in this course.',
          deadline: 'No deadline',
          mediaUrl: 'path/to/intro.pdf'
        },
        {
          id: 2,
          type: 'task',
          title: 'First Assignment',
          description: 'Submit your first assignment here.',
          deadline: '2024-03-01 23:59',
          submissionStatus: 'pending'
        }
      ]
    },
    {
      id: 2,
      title: 'Module 2: Advanced Topics',
      resources: [
        {
          id: 3,
          type: 'lesson',
          title: 'Lesson 2: Advanced Features',
          description: 'Learn about advanced features of the course.',
          deadline: 'No deadline',
          mediaUrl: 'path/to/advanced.pdf'
        },
        {
          id: 4,
          type: 'quiz',
          title: 'Quiz 1',
          description: 'Take the first quiz.',
          deadline: '2024-03-15 23:59',
          submissionStatus: 'pending'
        }
      ]
    }
  ]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleResourceClick = (resource) => {
    setSelectedResource(resource);
  };

  const generateCalendarDays = () => {
    const start = currentDate.startOf('month').startOf('week');
    const end = currentDate.endOf('month').endOf('week');
    const days = [];
    let day = start;

    while (day.isBefore(end)) {
      days.push(day);
      day = day.add(1, 'day');
    }

    return days;
  };

  const getEventsForDay = (date) => {
    return events.filter(event => {
      const start = dayjs(event.startDate);
      const end = dayjs(event.endDate);
      return date.isBetween(start, end, 'day', '[]');
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <ClassHeader>
        <Typography variant="h4">IT 212 OBJECT-ORIENTED PROGRAMMING</Typography>
        <Typography variant="subtitle1">2A-1 | TTH 9:30AM-12:00NN EB 309</Typography>
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
            {modules.map((module) => (
              <ModuleContainer key={module.id}>
                <ModuleHeader>
                  <Typography variant="subtitle1">{module.title}</Typography>
                </ModuleHeader>
                <Box>
                  {module.resources.map((resource) => (
                    <ResourceButton 
                      key={resource.id}
                      startIcon={
                        resource.type === 'lesson' ? <ArticleIcon /> :
                        resource.type === 'quiz' ? <QuizIcon /> :
                        resource.type === 'assignment' ? <AssignmentIcon /> :
                        <FolderIcon />
                      }
                    >
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
                          {(resource.type === 'task' || resource.type === 'quiz') && (
                            <Box
                              sx={{
                                ml: 2,
                                px: 2,
                                py: 0.5,
                                borderRadius: 1,
                                backgroundColor: resource.submissionStatus === 'submitted' ? '#4CAF50' : '#FFC600',
                                color: resource.submissionStatus === 'submitted' ? 'white' : 'black',
                              }}
                            >
                              {resource.submissionStatus === 'submitted' ? 'Submitted' : 'Pending'}
                            </Box>
                          )}
                        </Box>
                      </Button>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </TabPanel>

          {/* People Tab */}
          <TabPanel value={currentTab} index={1}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: '#FFC600', mb: 2 }}>
                  Teacher
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                  <Avatar>R</Avatar>
                  <Typography>Reyna</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: '#FFC600', mb: 2 }}>
                  Students
                </Typography>
                {/* Student list will be added here */}
              </Grid>
            </Grid>
          </TabPanel>

          {/* Calendar Tab */}
          <TabPanel value={currentTab} index={2}>
            <Box sx={{ p: 3 }}>
              <CalendarGrid>
                <Box className="calendar-header">
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ color: '#FFC600' }}>
                      {currentDate.format('MMMM YYYY')}
                    </Typography>
                    <Box>
                      <Button 
                        onClick={() => setCurrentDate(dayjs())}
                        sx={{ color: 'white' }}
                      >
                        Today
                      </Button>
                      <Button 
                        onClick={() => setCurrentDate(prev => prev.subtract(1, 'month'))}
                        sx={{ color: 'white' }}
                      >
                        Previous
                      </Button>
                      <Button 
                        onClick={() => setCurrentDate(prev => prev.add(1, 'month'))}
                        sx={{ color: 'white' }}
                      >
                        Next
                      </Button>
                    </Box>
                  </Box>
                  <Grid container sx={{ mt: 2 }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <Grid item xs key={day} sx={{ textAlign: 'center', color: '#999' }}>
                        {day}
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                <Box className="calendar-body">
                  {generateCalendarDays().map((day, index) => (
                    <Box
                      key={index}
                      className={`calendar-day ${
                        day.isSame(dayjs(), 'day') ? 'today' : ''
                      } ${
                        day.isSame(currentDate, 'month') ? '' : 'different-month'
                      }`}
                    >
                      <Typography sx={{ color: '#999', mb: 1 }}>
                        {day.format('D')}
                      </Typography>
                      {getEventsForDay(day).map(event => (
                        <CalendarEvent key={event.id}>
                          {event.title}
                        </CalendarEvent>
                      ))}
                    </Box>
                  ))}
                </Box>
              </CalendarGrid>

              <TimelineContainer>
                <Box className="timeline-header">
                  <Typography variant="h6" sx={{ color: '#FFC600' }}>
                    Timeline
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    {currentDate.format('MMMM YYYY')}
                  </Typography>
                </Box>
                {events.map((event) => (
                  <TimelineItem key={event.id}>
                    <Typography variant="subtitle1" sx={{ color: '#FFC600', mb: 1 }}>
                      {event.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      {dayjs(event.startDate).format('MMM D')} - {dayjs(event.endDate).format('MMM D, YYYY')}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: '#666',
                      display: 'inline-block',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      marginTop: '8px'
                    }}>
                      {event.type}
                    </Typography>
                  </TimelineItem>
                ))}
              </TimelineContainer>
            </Box>
          </TabPanel>
        </Box>
      </Box>

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
          <StudentResourceView
            resource={selectedResource}
            onClose={() => setSelectedResource(null)}
          />
        </Box>
      )}
    </Box>
  );
}

export default ClassView;