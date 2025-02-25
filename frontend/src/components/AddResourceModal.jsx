import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
  TextField,
  Box,
  styled,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useState } from 'react';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: '#222222',
    color: 'white',
    minWidth: '500px',
  },
}));

const StyledDialogTitle = styled(DialogTitle)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 24px',
  backgroundColor: '#333333',
});

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    color: 'white',
    backgroundColor: '#333333',
  },
  '& .MuiInputLabel-root': {
    color: '#999999',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#444444',
    },
    '&:hover fieldset': {
      borderColor: '#666666',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FFC600',
    },
  },
  marginBottom: '16px',
});

const StyledDateTimePicker = styled(DateTimePicker)({
  '& .MuiInputBase-root': {
    color: 'white',
    backgroundColor: '#333333',
  },
  '& .MuiInputLabel-root': {
    color: '#999999',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#444444',
    },
    '&:hover fieldset': {
      borderColor: '#666666',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FFC600',
    },
  },
  marginBottom: '16px',
});

const UploadButton = styled(Button)({
  backgroundColor: '#333333',
  color: 'white',
  '&:hover': {
    backgroundColor: '#444444',
  },
  marginBottom: '16px',
});

const CreateButton = styled(Button)({
  backgroundColor: '#FFC600',
  color: 'black',
  '&:hover': {
    backgroundColor: '#FFD700',
  },
});

const AddResourceModal = ({ open, onClose, resourceType }) => {
  const [deadline, setDeadline] = useState(null);

  const handleUpload = () => {
    // Placeholder for file upload functionality
    console.log('File upload clicked');
  };

  const handleCreate = () => {
    // Placeholder for create functionality
    console.log('Create clicked');
    onClose();
  };

  const getTitle = () => {
    switch (resourceType) {
      case 'lesson':
        return 'New Lesson';
      case 'task':
        return 'New Task';
      case 'quiz':
        return 'New Quiz';
      case 'resource':
        return 'New Resource';
      default:
        return 'New Item';
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md">
      <StyledDialogTitle>
        {getTitle()}
        <IconButton
          onClick={onClose}
          sx={{ color: 'white', '&:hover': { color: '#FFC600' } }}
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      
      <DialogContent sx={{ padding: '24px', backgroundColor: '#222222' }}>
        <StyledTextField
          fullWidth
          label="Title"
          variant="outlined"
          margin="normal"
        />
        
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StyledDateTimePicker
            label="Deadline"
            value={deadline}
            onChange={(newValue) => setDeadline(newValue)}
            sx={{ width: '100%' }}
          />
        </LocalizationProvider>
        
        <StyledTextField
          fullWidth
          label="Description"
          variant="outlined"
          margin="normal"
          multiline
          rows={4}
        />

        <UploadButton
          fullWidth
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={handleUpload}
        >
          Upload Media
        </UploadButton>
      </DialogContent>

      <DialogActions sx={{ padding: '16px 24px', backgroundColor: '#222222' }}>
        <CreateButton variant="contained" onClick={handleCreate}>
          Create +
        </CreateButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default AddResourceModal;
