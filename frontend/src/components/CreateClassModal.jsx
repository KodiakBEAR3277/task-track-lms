import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    backgroundColor: '#333333',
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
  '& .MuiInputLabel-root': {
    color: '#999999',
  },
});

function CreateClassModal({ open, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    schedule: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await onSubmit(formData);
      setFormData({ name: '', schedule: '', description: '' });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: { bgcolor: '#222222', minWidth: '400px' }
      }}
    >
      <DialogTitle sx={{ color: 'white' }}>Create New Class</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <StyledTextField
              label="Class Name"
              fullWidth
              required
              disabled={loading}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <StyledTextField
              label="Schedule"
              fullWidth
              disabled={loading}
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
            />
            <StyledTextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              disabled={loading}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button 
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: '#FFC600',
              color: 'black',
              '&:hover': { bgcolor: '#FFD700' }
            }}
          >
            {loading ? 'Creating...' : 'Create Class'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CreateClassModal;
