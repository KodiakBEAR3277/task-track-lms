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
} from '@mui/material';
import { useState } from 'react';

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

function Classes() {
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

  return (
    <Box sx={{ p: 3, backgroundColor: '#111111', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ color: 'white', mb: 4 }}>
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
    </Box>
  );
}

export default Classes; 