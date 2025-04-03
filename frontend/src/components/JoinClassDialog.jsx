import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert
} from '@mui/material';
import { useState } from 'react';

const JoinClassDialog = ({ open, onClose, onJoin }) => {
  const [classCode, setClassCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!classCode.trim()) {
      setError('Please enter a class code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onJoin(classCode);
      setClassCode('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to join class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{ sx: { bgcolor: '#222222', color: 'white' } }}
    >
      <DialogTitle>Join Class</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography variant="body2" sx={{ mb: 2, color: '#999' }}>
          Enter the class code provided by your teacher
        </Typography>
        <TextField
          autoFocus
          label="Class Code"
          fullWidth
          value={classCode}
          onChange={(e) => setClassCode(e.target.value.toUpperCase())}
          inputProps={{ maxLength: 6 }}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            },
            '& .MuiInputLabel-root': { color: '#999' }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: '#999' }}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={loading}
          sx={{ 
            bgcolor: '#FFC600',
            color: 'black',
            '&:hover': { bgcolor: '#FFD700' },
            '&.Mui-disabled': { bgcolor: '#666' }
          }}
        >
          Join
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JoinClassDialog;