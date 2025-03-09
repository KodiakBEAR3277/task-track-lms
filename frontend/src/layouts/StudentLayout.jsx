import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

const DRAWER_WIDTH = 280;

function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navigationItems = [
    { text: 'Dashboard', icon: <HomeIcon />, path: '/student/dashboard' },
    { text: 'Calendar', icon: <CalendarMonthIcon />, path: '/student/calendar' },
  ];

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden' // Prevent horizontal scrolling
    }}>
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Avatar sx={{ bgcolor: '#FFC600', color: '#000', width: 48, height: 48 }}>
          {user?.username?.charAt(0).toUpperCase() || 'S'}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ color: 'white' }}>
            {user?.username || 'Student'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>
            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Student'}
          </Typography>
        </Box>
      </Box>

      <List sx={{ 
        py: 2, 
        flex: 1,
        overflowY: 'auto',  // Allow vertical scrolling
        overflowX: 'hidden' // Prevent horizontal scrolling
      }}>
        {navigationItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              mx: 1,
              borderRadius: 1,
              mb: 0.5,
              bgcolor: location.pathname === item.path ? 'rgba(255, 198, 0, 0.15)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(255, 198, 0, 0.08)',
              }
            }}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path ? '#FFC600' : 'white',
              minWidth: 40 
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ 
                color: location.pathname === item.path ? '#FFC600' : 'white'
              }}
            />
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            '&:hover': {
              bgcolor: 'rgba(255, 68, 68, 0.08)',
            }
          }}
        >
          <ListItemIcon sx={{ color: '#FF4444', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" sx={{ color: '#FF4444' }} />
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Mobile menu button */}
      {isMobile && (
        <IconButton
          onClick={() => setMobileOpen(!mobileOpen)}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: theme.zIndex.drawer + 2,
            bgcolor: '#333333',
            color: 'white',
            '&:hover': {
              bgcolor: '#444444',
            }
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            bgcolor: '#222222',
            borderRight: 'none',
            overflow: 'hidden', // Prevent drawer paper from scrolling
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            bgcolor: '#222222',
            borderRight: 'none',
            overflow: 'hidden', // Prevent drawer paper from scrolling
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#111111',
          overflow: 'auto',
          position: 'relative',
          width: { xs: '100%', sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default StudentLayout;