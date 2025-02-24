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
  Chip,
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

const StyledTableCell = styled(TableCell)({
  color: 'white',
  borderBottom: '1px solid #333',
});

const StyledTableRow = styled(TableRow)({
  '&:hover': {
    backgroundColor: '#2a2a2a',
  },
});

const StatusChip = styled(Chip)(({ status }) => ({
  backgroundColor: status === 'active' ? '#4caf50' : '#666',
  color: 'white',
}));

const NestedListItem = styled(ListItem)({
  paddingLeft: '32px',
  '&:hover': {
    backgroundColor: '#333333',
  },
});

function Classes() {
  const navigate = useNavigate();
  const [openFolder, setOpenFolder] = useState(true);
  // Mock classes data (replace with API call later)
  const [classes] = useState([
    {
      id: 1,
      name: 'IT 212 OBJECT-ORIENTED PROGRAMMING',
      teacher: 'John Doe',
      students: 30,
      status: 'active',
    },
    {
      id: 2,
      name: 'CS 101 INTRODUCTION TO PROGRAMMING',
      teacher: 'Jane Smith',
      students: 25,
      status: 'active',
    },
  ]);

  const handleFolderClick = () => {
    setOpenFolder(!openFolder);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledDrawer variant="permanent" anchor="left">
        <List sx={{ marginTop: '2rem' }}>
          <ListItem button onClick={() => navigate('/admin/dashboard')}>
            <ListItemIcon>
              <HomeIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          <ListItem button onClick={() => navigate('/admin/users')}>
            <ListItemIcon>
              <PeopleIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>

          <ListItem button onClick={handleFolderClick}>
            <ListItemIcon>
              <FolderIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Folder" />
            {openFolder ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={openFolder} timeout="auto" unmountOnExit>
            <List>
              <NestedListItem button onClick={() => navigate('/admin/teachers')}>
                <ListItemIcon>
                  <PersonIcon sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Teachers" />
              </NestedListItem>
              <NestedListItem 
                button 
                onClick={() => navigate('/admin/classes')}
                sx={{ 
                  backgroundColor: '#333333',
                  borderLeft: '4px solid #FFC600'
                }}
              >
                <ListItemIcon>
                  <SchoolIcon sx={{ color: '#FFC600' }} />
                </ListItemIcon>
                <ListItemText primary="Classes" sx={{ color: '#FFC600' }} />
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
          Classes
        </Typography>

        <TableContainer component={Paper} sx={{ backgroundColor: '#222222' }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Class Name</StyledTableCell>
                <StyledTableCell>Teacher</StyledTableCell>
                <StyledTableCell>Students</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classes.map((class_) => (
                <StyledTableRow key={class_.id}>
                  <StyledTableCell>{class_.name}</StyledTableCell>
                  <StyledTableCell>{class_.teacher}</StyledTableCell>
                  <StyledTableCell>{class_.students}</StyledTableCell>
                  <StyledTableCell>
                    <StatusChip 
                      label={class_.status.charAt(0).toUpperCase() + class_.status.slice(1)}
                      status={class_.status}
                      size="small"
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MainContent>
    </Box>
  );
}

export default Classes;