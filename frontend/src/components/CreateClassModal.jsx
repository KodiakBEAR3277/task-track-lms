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

const AddButton = styled(Button)({
  backgroundColor: '#FFC600',
  color: 'black',
  '&:hover': {
    backgroundColor: '#FFD700',
  },
});

const CreateClassModal = ({ open, onClose }) => {
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [schedule, setSchedule] = useState('');

  const handleCreate = () => {
    // Placeholder for create functionality
    console.log('Create class clicked', { className, section, schedule });
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md">
      <StyledDialogTitle>
        Create New Class
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
          label="Class Name"
          variant="outlined"
          margin="normal"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
        
        <StyledTextField
          fullWidth
          label="Section"
          variant="outlined"
          margin="normal"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          InputProps={{
            sx: { color: 'rgba(255, 255, 255, 0.7)' }
          }}
        />

        <StyledTextField
          fullWidth
          label="Schedule"
          variant="outlined"
          margin="normal"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          placeholder="e.g., MWF 9:00 AM - 10:30 AM"
        />
      </DialogContent>

      <DialogActions sx={{ padding: '16px 24px', backgroundColor: '#222222' }}>
        <AddButton variant="contained" onClick={handleCreate}>
          Add Class +
        </AddButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default CreateClassModal;
