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
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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

const RoleChip = styled(Chip)(({ role }) => ({
  backgroundColor: role === 'teacher' ? '#FFC600' : '#666',
  color: role === 'teacher' ? '#000' : '#fff',
}));

function Users() {
  const navigate = useNavigate();
  const [folderOpen, setFolderOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock users data (replace with API call later)
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'teacher' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'student' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'student' },
  ]);

  const handleFolderClick = () => {
    setFolderOpen(!folderOpen);
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleRoleChange = (newRole) => {
    // Update the user's role in the state (replace with API call later)
    setUsers(users.map(user => 
      user.id === selectedUser.id ? { ...user, role: newRole } : user
    ));
    handleMenuClose();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledDrawer variant="permanent">
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
            selected
            onClick={() => navigate('/admin/users')}
          >
            <ListItemIcon sx={{ color: '#FFC600' }}>
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
              <NestedListItem button onClick={() => navigate('/admin/teachers')}>
                <ListItemIcon>
                  <PersonIcon sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Teachers" />
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
        <Typography variant="h4" sx={{ color: 'white', mb: 4 }}>
          Users
        </Typography>

        <TableContainer component={Paper} sx={{ backgroundColor: '#222222' }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Role</StyledTableCell>
                <StyledTableCell align="right">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <StyledTableRow key={user.id}>
                  <StyledTableCell>{user.name}</StyledTableCell>
                  <StyledTableCell>{user.email}</StyledTableCell>
                  <StyledTableCell>
                    <RoleChip 
                      label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      role={user.role}
                      size="small"
                    />
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, user)}
                      sx={{ color: 'white' }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              backgroundColor: '#333',
              color: 'white',
            }
          }}
        >
          <MenuItem 
            onClick={() => handleRoleChange('student')}
            sx={{ color: selectedUser?.role === 'student' ? '#FFC600' : 'white' }}
          >
            Set as Student
          </MenuItem>
          <MenuItem 
            onClick={() => handleRoleChange('teacher')}
            sx={{ color: selectedUser?.role === 'teacher' ? '#FFC600' : 'white' }}
          >
            Set as Teacher
          </MenuItem>
        </Menu>
      </MainContent>
    </Box>
  );
}

export default Users;
