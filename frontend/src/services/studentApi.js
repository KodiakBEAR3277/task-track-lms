import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

// Add request interceptor to handle auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const studentApi = {
  getEnrolledClasses: async () => {
    try {
      console.log('Fetching enrolled classes...');
      const response = await api.get('/student/classes');
      console.log('Raw response:', response);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Failed to fetch enrolled classes:', error);
      throw error.response?.data || error.message;
    }
  },

  joinClass: async (classCode) => {
    try {
      console.log('Attempting to join class with code:', classCode);
      const response = await api.post('/student/classes/join', { classCode });
      console.log('Join class response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to join class:', error);
      if (error.response?.status === 404) {
        throw new Error('Invalid class code or class is inactive');
      }
      if (error.response?.status === 400) {
        throw new Error(error.response.data.error || 'Already enrolled or cannot join');
      }
      throw new Error(error.response?.data?.error || 'Failed to join class');
    }
  },

  leaveClass: async (classId) => {
    if (!classId) {
      throw new Error('Class ID is required');
    }
    try {
      console.log('Attempting to leave class:', classId);
      const response = await api.delete(`/student/classes/${classId}`);
      console.log('Leave class response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to leave class:', error);
      if (error.response?.status === 404) {
        throw new Error('Not enrolled in this class');
      }
      if (error.response?.status === 500) {
        throw new Error(error.response.data.error || 'Server error while leaving class');
      }
      throw new Error(error.response?.data?.error || 'Failed to leave class');
    }
  },

  getClassDetails: async (classId) => {
    try {
      console.log('Fetching class details for:', classId);
      const response = await api.get(`/student/classes/${classId}`);
      console.log('Class details response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch class details:', error);
      if (error.response?.status === 403) {
        throw new Error('You are not enrolled in this class');
      }
      throw new Error(error.response?.data?.error || 'Failed to load class details');
    }
  },

  getClassModules: async (classId) => {
    try {
      console.log('Fetching modules for class:', classId);
      const response = await api.get(`/student/classes/${classId}/modules`);
      console.log('Raw modules response:', response);
      console.log('Modules data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch class modules:', error);
      if (error.response?.status === 403) {
        throw new Error('You are not enrolled in this class');
      }
      throw new Error(error.response?.data?.error || 'Failed to load class modules');
    }
  },

  getClassStudents: async (classId) => {
    try {
      const response = await api.get(`/student/classes/${classId}/students`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch class students:', error);
      throw new Error(error.response?.data?.error || 'Failed to load students');
    }
  },
};

export default studentApi;