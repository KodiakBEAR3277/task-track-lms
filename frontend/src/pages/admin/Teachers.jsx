import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
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
});

const NestedListItem = styled(ListItem)({
  paddingLeft: '32px',
  '&:hover': {
    backgroundColor: '#333333',
  },
});

const StyledTableCell = styled(TableCell)({
  color: 'white',
  borderBottom: '1px solid #333',
});

const StyledTableRow = styled(TableRow)({
  '&:hover': {
    backgroundColor: '#2a2a2a',
  },
});

function Teachers() {
  const navigate = useNavigate();
  const [folderOpen, setFolderOpen] = useState(true);
  
  // Mock teachers data
  const [teachers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      classes: 3,
      students: 90,
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      classes: 2,
      students: 60,
    },
  ]);

  const handleFolderClick = () => {
    setFolderOpen(!folderOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledDrawer variant="permanent" anchor="left">
        <List sx={{ marginTop: '2rem' }}>
          {/* Home */}
          <ListItem 
            button 
            onClick={() => navigate('/admin/dashboard')}
          >
            <ListItemIcon sx={{ color: 'white' }}>
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
            <List>
              <NestedListItem 
                button 
                onClick={() => navigate('/admin/teachers')}
                sx={{ 
                  backgroundColor: '#333333',
                  borderLeft: '4px solid #FFC600'
                }}
              >
                <ListItemIcon>
                  <PersonIcon sx={{ color: '#FFC600' }} />
                </ListItemIcon>
                <ListItemText primary="Teachers" sx={{ color: '#FFC600' }} />
              </NestedListItem>
              <NestedListItem button onClick={() => navigate('/admin/classes')}>
                <ListItemIcon>
                  <SchoolIcon sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Classes" />
              </NestedListItem>
              <NestedListItem button onClick={() => navigate('/admin/students')}>
                <ListItemIcon>
                  <PeopleIcon sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Students" />
              </NestedListItem>
            </List>
          </Collapse>
        </List>
      </StyledDrawer>

      <MainContent>
        <Typography variant="h4" sx={{ color: 'white', mb: 3 }}>
          Teachers
        </Typography>
        <TableContainer component={Paper} sx={{ backgroundColor: '#222222' }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Classes</StyledTableCell>
                <StyledTableCell>Total Students</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachers.map((teacher) => (
                <StyledTableRow key={teacher.id}>
                  <StyledTableCell>{teacher.name}</StyledTableCell>
                  <StyledTableCell>{teacher.email}</StyledTableCell>
                  <StyledTableCell>{teacher.classes}</StyledTableCell>
                  <StyledTableCell>{teacher.students}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MainContent>
    </Box>
  );
}

export default Teachers; 