import { Box, Typography, styled, List, ListItem, ListItemIcon, ListItemText, Drawer } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs from 'dayjs';

// Import the drawer components
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

const SidebarItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 24px',
  color: 'white',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(255, 198, 0, 0.1)',
  },
  '& .icon': {
    marginRight: '12px',
    color: '#FFC600',
  },
});

// Calendar styled components
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

function StudentCalendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(dayjs());

  // Mock events data
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
    return events.filter(event => {
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
            onClick={() => navigate('/student/dashboard')}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem 
            button
            selected
            onClick={() => navigate('/student/calendar')}
          >
            <ListItemIcon sx={{ color: '#FFC600' }}>
              <CalendarMonthIcon />
            </ListItemIcon>
            <ListItemText primary="Calendar" />
          </ListItem>
        </List>
      </StyledDrawer>

      {/* Main Content */}
      <MainContent>
        <Typography variant="h4" sx={{ color: 'white', mb: 4 }}>Calendar</Typography>
        
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
      </MainContent>
    </Box>
  );
}

export default StudentCalendar; 