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
  IconButton,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { useState } from 'react';

const StyledPaper = styled(Paper)({
  backgroundColor: '#222222',
  color: 'white',
  padding: '24px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '24px',
});

const StyledTableCell = styled(TableCell)({
  color: 'white',
  borderBottom: '1px solid #333333',
  '&.MuiTableCell-head': {
    backgroundColor: '#333333',
    fontWeight: 'bold',
  },
});

const StyledTableRow = styled(TableRow)({
  '&:nth-of-type(odd)': {
    backgroundColor: '#2A2A2A',
  },
  '&:hover': {
    backgroundColor: '#333333',
  },
});

const StatusChip = styled(Chip)({
  '&.submitted': {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  '&.pending': {
    backgroundColor: '#FFC600',
    color: 'black',
  },
});

const ResourceView = ({ resource, onClose }) => {
  // Mock data for student submissions
  const [submissions] = useState([
    { id: 1, studentName: 'John Doe', submissionDate: '2024-02-26 14:30', status: 'submitted' },
    { id: 2, studentName: 'Jane Smith', submissionDate: '-', status: 'pending' },
  ]);

  const renderContent = () => {
    switch (resource.type) {
      case 'lesson':
      case 'resource':
        return (
          <>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {resource.description}
            </Typography>
            {resource.mediaUrl && (
              <Button
                variant="contained"
                startIcon={<CloudDownloadIcon />}
                sx={{
                  backgroundColor: '#333333',
                  color: 'white',
                  '&:hover': { backgroundColor: '#444444' },
                }}
              >
                Download Material
              </Button>
            )}
          </>
        );

      case 'task':
      case 'quiz':
        return (
          <>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {resource.description}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2, color: '#FFC600' }}>
              Student Submissions
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Student Name</StyledTableCell>
                    <StyledTableCell>Submission Date</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.map((submission) => (
                    <StyledTableRow key={submission.id}>
                      <StyledTableCell>{submission.studentName}</StyledTableCell>
                      <StyledTableCell>{submission.submissionDate}</StyledTableCell>
                      <StyledTableCell>
                        <StatusChip
                          label={submission.status}
                          className={submission.status}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        {submission.status === 'submitted' && (
                          <Button
                            size="small"
                            startIcon={<CloudDownloadIcon />}
                            sx={{ color: '#FFC600' }}
                          >
                            View
                          </Button>
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <StyledPaper elevation={3}>
      <Header>
        <Box>
          <Typography variant="h5" sx={{ mb: 1 }}>
            {resource.title}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#999999' }}>
            Due: {resource.deadline}
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose}
          sx={{ color: 'white', '&:hover': { color: '#FFC600' } }}
        >
          <CloseIcon />
        </IconButton>
      </Header>
      {renderContent()}
    </StyledPaper>
  );
};

export default ResourceView;
