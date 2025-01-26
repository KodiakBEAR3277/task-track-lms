import {
  Box,
  Typography,
  styled,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Container as MuiContainer,
  Grid as MuiGrid,
  Card,
  CardContent,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import FolderIcon from '@mui/icons-material/Folder';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';

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

const NestedListItem = styled(ListItem)({
  paddingLeft: '32px',
  '&:hover': {
    backgroundColor: 'rgba(255, 198, 0, 0.1)',
  },
});

const StyledCard = styled(Card)({
  backgroundColor: '#222222',
  color: 'white',
  height: '100%',
  '&:hover': {
    backgroundColor: '#2a2a2a',
    cursor: 'pointer',
    transform: 'translateY(-4px)',
  },
  transition: 'transform 0.2s ease-in-out',
});

const StatNumber = styled(Typography)({
  color: '#FFC600',
  fontWeight: 'bold',
  fontSize: '2rem',
  marginBottom: '8px',
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [folderOpen, setFolderOpen] = useState(false);

  const handleFolderClick = () => {
    setFolderOpen(!folderOpen);
  };

  // Mock statistics
  const stats = {
    totalUsers: 150,
    totalTeachers: 15,
    totalStudents: 135,
    activeClasses: 12,
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledDrawer variant="permanent">
        <List sx={{ marginTop: '2rem' }}>
          {/* Home */}
          <ListItem 
            button 
            selected
            onClick={() => navigate('/admin/dashboard')}
          >
            <ListItemIcon sx={{ color: '#FFC600' }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          {/* Users */}
          <ListItem 
            button
            onClick={() => navigate('/admin/users')}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>

          {/* Folder with dropdown */}
          <ListItem button onClick={handleFolderClick}>
            <ListItemIcon sx={{ color: 'white' }}>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary="Folder" />
            {folderOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          {/* Folder dropdown content */}
          <Collapse in={folderOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <NestedListItem 
                button
                onClick={() => navigate('/admin/teachers')}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText primary="Teachers" />
              </NestedListItem>
              <NestedListItem 
                button
                onClick={() => navigate('/admin/students')}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Students" />
              </NestedListItem>
            </List>
          </Collapse>
        </List>
      </StyledDrawer>

      <MainContent>
        <MuiContainer>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ color: 'white', mb: 3 }}>
              Admin Dashboard
            </Typography>
          </Box>

          <MuiGrid container spacing={3}>
            {/* Total Users Card */}
            <MuiGrid item xs={12} sm={6} md={3}>
              <StyledCard onClick={() => navigate('/admin/users')}>
                <CardContent>
                  <PeopleIcon sx={{ color: '#FFC600', fontSize: 40, mb: 2 }} />
                  <StatNumber>{stats.totalUsers}</StatNumber>
                  <Typography>Total Users</Typography>
                </CardContent>
              </StyledCard>
            </MuiGrid>

            {/* Teachers Card */}
            <MuiGrid item xs={12} sm={6} md={3}>
              <StyledCard onClick={() => navigate('/admin/teachers')}>
                <CardContent>
                  <SchoolIcon sx={{ color: '#FFC600', fontSize: 40, mb: 2 }} />
                  <StatNumber>{stats.totalTeachers}</StatNumber>
                  <Typography>Teachers</Typography>
                </CardContent>
              </StyledCard>
            </MuiGrid>

            {/* Students Card */}
            <MuiGrid item xs={12} sm={6} md={3}>
              <StyledCard onClick={() => navigate('/admin/students')}>
                <CardContent>
                  <PersonIcon sx={{ color: '#FFC600', fontSize: 40, mb: 2 }} />
                  <StatNumber>{stats.totalStudents}</StatNumber>
                  <Typography>Students</Typography>
                </CardContent>
              </StyledCard>
            </MuiGrid>

            {/* Active Classes Card */}
            <MuiGrid item xs={12} sm={6} md={3}>
              <StyledCard onClick={() => navigate('/admin/classes')}>
                <CardContent>
                  <SchoolIcon sx={{ color: '#FFC600', fontSize: 40, mb: 2 }} />
                  <StatNumber>{stats.activeClasses}</StatNumber>
                  <Typography>Active Classes</Typography>
                </CardContent>
              </StyledCard>
            </MuiGrid>
          </MuiGrid>
        </MuiContainer>
      </MainContent>
    </Box>
  );
}

export default AdminDashboard; 