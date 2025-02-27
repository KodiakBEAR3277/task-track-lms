import {
  Box,
  Typography,
  Paper,
  styled,
  IconButton,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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

const UploadBox = styled(Box)({
  border: '2px dashed #444444',
  borderRadius: '8px',
  padding: '24px',
  textAlign: 'center',
  backgroundColor: '#333333',
  marginTop: '16px',
  cursor: 'pointer',
  '&:hover': {
    borderColor: '#FFC600',
    backgroundColor: '#383838',
  },
});

const StatusChip = styled(Box)({
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: '16px',
  fontSize: '0.875rem',
  fontWeight: 500,
  '&.submitted': {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  '&.pending': {
    backgroundColor: '#FFC600',
    color: 'black',
  },
});

const StudentResourceView = ({ resource, onClose }) => {
  const [file, setFile] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(resource.submissionStatus || 'pending');

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      // In a real application, you would handle the file upload to the server here
      console.log('File selected:', uploadedFile);
    }
  };

  const handleSubmit = () => {
    if (file) {
      // In a real application, you would handle the submission to the server here
      setSubmissionStatus('submitted');
      console.log('Submitting file:', file);
    }
  };

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
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#FFC600' }}>
                Your Submission
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#999999', mb: 1 }}>
                  Status
                </Typography>
                <StatusChip className={submissionStatus}>
                  {submissionStatus.charAt(0).toUpperCase() + submissionStatus.slice(1)}
                </StatusChip>
              </Box>

              {submissionStatus === 'pending' && (
                <>
                  <input
                    type="file"
                    id="file-upload"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="file-upload">
                    <UploadBox>
                      <CloudUploadIcon sx={{ fontSize: 40, color: '#666666', mb: 1 }} />
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {file ? file.name : 'Click to upload your file'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#999999' }}>
                        Drag and drop a file here or click to select
                      </Typography>
                    </UploadBox>
                  </label>

                  {file && (
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      sx={{
                        mt: 2,
                        backgroundColor: '#FFC600',
                        color: 'black',
                        '&:hover': { backgroundColor: '#FFD700' },
                      }}
                    >
                      Submit
                    </Button>
                  )}
                </>
              )}

              {submissionStatus === 'submitted' && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ color: '#4CAF50' }}>
                    ✓ Submitted successfully
                  </Typography>
                </Box>
              )}
            </Box>
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

export default StudentResourceView;
