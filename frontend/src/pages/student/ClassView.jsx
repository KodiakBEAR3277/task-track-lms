import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import studentApi from '../../services/studentApi';

// Reuse styled components
const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: '#222222',
  '& .MuiTab-root': {
    color: 'white',
    '&.Mui-selected': {
      color: '#FFC600',
    }
  },
  '& .MuiTabs-indicator': {
    backgroundColor: '#FFC600',
  }
}));

const ModuleContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#222222',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2)
}));

const ContentArea = styled(Box)(({ theme }) => ({
  backgroundColor: '#222222',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  minHeight: 400
}));

const ContentListItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: '#2a2a2a',
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: '#333333',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(255, 198, 0, 0.15)',
    '&:hover': {
      backgroundColor: 'rgba(255, 198, 0, 0.25)',
    }
  }
}));

const ActivitiesTab = ({ classId, modules }) => {
  const [selectedContent, setSelectedContent] = useState(null);

  console.log('Modules received in ActivitiesTab:', modules);

  const renderContentActions = (content) => {
    if (!content.link_url) return null;

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" sx={{ color: '#999' }}>
          {content.type === 'task' ? 'Task Link' : 
           content.type === 'quiz' ? 'Quiz Link' : 'Material Link'}: {' '}
          <a 
            href={content.link_url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: '#2196F3',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            {content.link_url}
          </a>
        </Typography>
        {content.points && (
          <Typography variant="body2" sx={{ color: '#999', mt: 1 }}>
            Total Points: {content.points}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', gap: 3 }}>
      {/* Modules Sidebar */}
      <Box sx={{ width: 320, flexShrink: 0 }}>
        {modules && modules.length > 0 ? (
          modules.map((module) => (
            <ModuleContainer key={module.id}>
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 500, mb: 2 }}>
                {module.title}
              </Typography>
              <List sx={{ py: 0 }}>
                {module.contents && module.contents.length > 0 ? (
                  module.contents.map((content) => (
                    <ContentListItem
                      key={content.id}
                      button
                      selected={selectedContent?.id === content.id}
                      onClick={() => setSelectedContent(content)}
                    >
                      <ListItemText
                        primary={content.title}
                        secondary={
                          <Typography variant="body2" sx={{ color: '#999' }}>
                            {content.type === 'task' ? '📝 Performance Task' :
                             content.type === 'material' ? '📚 Learning Material' : '📋 Quiz'}
                            {content.type === 'task' && content.due_date && 
                              ` • Due: ${new Date(content.due_date).toLocaleDateString()}`}
                          </Typography>
                        }
                        sx={{
                          '& .MuiListItemText-primary': { color: 'white' }
                        }}
                      />
                    </ContentListItem>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: '#666', p: 1 }}>
                    No content available
                  </Typography>
                )}
              </List>
            </ModuleContainer>
          ))
        ) : (
          <Typography variant="body2" sx={{ color: '#666' }}>
            No modules available
          </Typography>
        )}
      </Box>

      {/* Content Area */}
      <Box sx={{ flex: 1 }}>
        {selectedContent ? (
          <ContentArea>
            <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
              {selectedContent.title}
            </Typography>

            <Typography sx={{ color: '#999', mb: 3 }}>
              {selectedContent.description}
            </Typography>

            {selectedContent.type === 'task' && (
              <Box>
                <Typography variant="subtitle1" sx={{ color: 'white', mb: 2 }}>
                  Due Date: {new Date(selectedContent.due_date).toLocaleString()}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'white', mb: 2 }}>
                  Points: {selectedContent.points}
                </Typography>
                {renderContentActions(selectedContent)}
              </Box>
            )}

            {(selectedContent.type === 'material' || selectedContent.type === 'quiz') && 
              renderContentActions(selectedContent)}
          </ContentArea>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: 400,
            color: '#666',
            bgcolor: '#222222',
            borderRadius: 1
          }}>
            Select a content item to view details
          </Box>
        )}
      </Box>
    </Box>
  );
};

const StudentsTab = ({ classId }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await studentApi.getClassStudents(classId);
        setStudents(data);
      } catch (err) {
        console.error('Failed to fetch students:', err);
        setError('Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [classId]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        backgroundColor: '#222222',
        '& .MuiTableCell-root': {
          color: 'white',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
            <TableCell>Username</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Enrolled Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => (
            <TableRow 
              key={student.id}
              sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}
            >
              <TableCell>{student.username}</TableCell>
              <TableCell>
                <Box
                  sx={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    display: 'inline-block'
                  }}
                >
                  {student.status}
                </Box>
              </TableCell>
              <TableCell>
                {new Date(student.enrolled_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Update the main return statement in StudentClassView
function StudentClassView() {
  const { id } = useParams();
  const [tab, setTab] = useState(0);
  const [classData, setClassData] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchClassData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [details, classModules] = await Promise.all([
          studentApi.getClassDetails(id),
          studentApi.getClassModules(id)
        ]);

        if (isMounted) {
          setClassData(details);
          setModules(classModules);
        }
      } catch (err) {
        console.error('Error fetching class data:', err);
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchClassData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header with dark background */}
      <Box sx={{ bgcolor: '#222222', p: 3, mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'white' }}>
          {classData?.name}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#999' }}>
          Class Code: {classData?.code}
        </Typography>
        <Typography variant="body2" sx={{ color: '#999', mt: 1 }}>
          {classData?.schedule}
        </Typography>
        <Typography variant="body2" sx={{ color: '#999', mt: 1 }}>
          Teacher: {classData?.teacher_name}
        </Typography>
      </Box>

      {/* Tabs */}
      <StyledTabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
        <Tab label="Activities" />
        <Tab label="Students" />
      </StyledTabs>

      {/* Tab Content */}
      <Box sx={{ mt: 3 }}>
        {tab === 0 && <ActivitiesTab classId={id} modules={modules} />}
        {tab === 1 && <StudentsTab classId={id} />}
      </Box>
    </Box>
  );
}

export default StudentClassView;