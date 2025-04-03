import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  IconButton,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';

const FileUploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed rgba(255, 255, 255, 0.23)',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  textAlign: 'center',
  cursor: 'pointer',
  '&:hover': {
    borderColor: '#FFC600',
  }
}));

const ContentCreationModal = ({ open, onClose, onSubmit, moduleId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('task');
  const [dueDate, setDueDate] = useState('');
  const [points, setPoints] = useState('100');
  const [attachmentType, setAttachmentType] = useState('none'); // 'none', 'file', 'link'
  const [fileAttachment, setFileAttachment] = useState(null);
  const [linkUrl, setLinkUrl] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileAttachment(file);
      setAttachmentType('file');
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    const formData = new FormData();
    formData.append('moduleId', moduleId);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('type', type);
    
    if (type === 'task') {
      formData.append('dueDate', dueDate);
      formData.append('points', points);
    }

    if (attachmentType === 'file' && fileAttachment) {
      formData.append('file', fileAttachment);
    } else if (attachmentType === 'link' && linkUrl) {
      formData.append('linkUrl', linkUrl);
    }

    onSubmit(formData);
    handleReset();
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setType('task');
    setDueDate('');
    setPoints('100');
    setAttachmentType('none');
    setFileAttachment(null);
    setLinkUrl('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { bgcolor: '#222222', color: 'white' } }}
    >
      <DialogTitle>Add Content</DialogTitle>
      <DialogContent>
        <TextField
          select
          margin="dense"
          label="Content Type"
          fullWidth
          value={type}
          onChange={(e) => setType(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            },
            '& .MuiInputLabel-root': { color: '#999' }
          }}
        >
          <MenuItem value="task">Performance Task</MenuItem>
          <MenuItem value="material">Learning Material</MenuItem>
          <MenuItem value="quiz">Quiz</MenuItem>
        </TextField>

        <TextField
          margin="dense"
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            },
            '& .MuiInputLabel-root': { color: '#999' }
          }}
        />

        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            },
            '& .MuiInputLabel-root': { color: '#999' }
          }}
        />

        {type === 'task' && (
          <>
            <TextField
              margin="dense"
              label="Due Date"
              type="datetime-local"
              fullWidth
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                },
                '& .MuiInputLabel-root': { color: '#999' }
              }}
            />
            <TextField
              margin="dense"
              label="Points"
              type="number"
              fullWidth
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              InputProps={{ inputProps: { min: 0 } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                },
                '& .MuiInputLabel-root': { color: '#999' }
              }}
            />
          </>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ color: '#999', mb: 1 }}>
            Attachment
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={attachmentType === 'file' ? 'contained' : 'outlined'}
              startIcon={<UploadFileIcon />}
              component="label"
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.23)',
                color: attachmentType === 'file' ? 'black' : 'white',
                bgcolor: attachmentType === 'file' ? '#FFC600' : 'transparent'
              }}
            >
              Upload File
              <input
                type="file"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            <Button
              variant={attachmentType === 'link' ? 'contained' : 'outlined'}
              startIcon={<LinkIcon />}
              onClick={() => setAttachmentType('link')}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.23)',
                color: attachmentType === 'link' ? 'black' : 'white',
                bgcolor: attachmentType === 'link' ? '#FFC600' : 'transparent'
              }}
            >
              Add Link
            </Button>
          </Box>
        </Box>

        {attachmentType === 'file' && fileAttachment && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography>{fileAttachment.name}</Typography>
              <IconButton 
                size="small" 
                onClick={() => {
                  setFileAttachment(null);
                  setAttachmentType('none');
                }}
                sx={{ color: '#FF4444' }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        )}

        {attachmentType === 'link' && (
          <TextField
            margin="dense"
            label="URL"
            fullWidth
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
              },
              '& .MuiInputLabel-root': { color: '#999' }
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          sx={{ color: '#FFC600' }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContentCreationModal;