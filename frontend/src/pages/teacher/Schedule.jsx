import { Box, Typography, styled, List, ListItem, ListItemIcon, ListItemText, Drawer } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

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

const ScheduleEvent = styled(Box)(({ type }) => ({
  backgroundColor: type === 'class' ? 'rgba(255, 198, 0, 0.2)' : 'rgba(82, 196, 26, 0.2)',
  border: `1px solid ${type === 'class' ? '#FFC600' : '#52c41a'}`,
  borderRadius: '4px',
  padding: '4px 8px',
  fontSize: '0.75rem',
  color: type === 'class' ? '#FFC600' : '#52c41a',
  marginBottom: '4px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  '&:hover': {
    backgroundColor: type === 'class' ? 'rgba(255, 198, 0, 0.3)' : 'rgba(82, 196, 26, 0.3)',
  }
}));

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

function TeacherSchedule() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(dayjs());

  // Mock schedule data
  const scheduleEvents = [
    {
      id: 1,
      title: 'IT 212 - Object-Oriented Programming',
      startDate: '2024-09-02',
      endDate: '2024-09-13',
      type: 'class',
      section: '2A-1',
      room: 'EB 309',
      time: '9:30 AM - 12:00 NN'
    },
    {
      id: 2,
      title: 'IT 211 - Data Structures',
      startDate: '2024-09-13',
      endDate: '2024-09-13',
      type: 'class',
      section: '2B-1',
      room: 'EB 310',
      time: '1:00 PM - 3:30 PM'
    },
    {
      id: 3,
      title: 'Department Meeting',
      startDate: '2024-09-15',
      endDate: '2024-09-15',
      type: 'meeting',
      room: 'Conference Room',
      time: '10:00 AM - 11:00 AM'
    }
  ];

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
    return scheduleEvents.filter(event => {
      const start = dayjs(event.startDate);
      const end = dayjs(event.endDate);
      return date.isBetween(start, end, 'day', '[]');
    });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledDrawer variant="permanent">
        <List sx={{ marginTop: '2rem' }}>
          <ListItem 
            button 
            onClick={() => navigate('/teacher/dashboard')}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem 
            button
            selected
            onClick={() => navigate('/teacher/schedule')}
          >
            <ListItemIcon sx={{ color: '#FFC600' }}>
              <CalendarMonthIcon />
            </ListItemIcon>
            <ListItemText primary="Schedule" />
          </ListItem>
        </List>
      </StyledDrawer>

      <MainContent>
        <Typography variant="h4" sx={{ color: 'white', mb: 4 }}>Schedule</Typography>
        
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
                  <ScheduleEvent key={event.id} type={event.type}>
                    {event.title}
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                      {event.time}
                    </Typography>
                  </ScheduleEvent>
                ))}
              </Box>
            ))}
          </Box>
        </CalendarGrid>

        <TimelineContainer>
          <Box className="timeline-header">
            <Typography variant="h6" sx={{ color: '#FFC600' }}>
              Schedule Timeline
            </Typography>
            <Typography variant="body2" sx={{ color: '#999' }}>
              {currentDate.format('MMMM YYYY')}
            </Typography>
          </Box>
          {scheduleEvents.map((event) => (
            <TimelineItem key={event.id}>
              <Typography variant="subtitle1" sx={{ color: '#FFC600', mb: 1 }}>
                {event.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#999' }}>
                {event.time} | {event.room}
              </Typography>
              {event.section && (
                <Typography variant="body2" sx={{ color: '#999' }}>
                  Section: {event.section}
                </Typography>
              )}
              <Typography variant="caption" sx={{ 
                color: '#666',
                display: 'inline-block',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '2px 8px',
                borderRadius: '4px',
                marginTop: '8px'
              }}>
                {event.type === 'class' ? 'Class Schedule' : 'Meeting'}
              </Typography>
            </TimelineItem>
          ))}
        </TimelineContainer>
      </MainContent>
    </Box>
  );
}

export default TeacherSchedule; 