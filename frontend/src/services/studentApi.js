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
      const response = await api.get('/student/classes');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      throw error.response?.data || error.message;
    }
  },

  joinClass: async (classCode) => {
    if (!classCode?.trim()) {
      throw new Error('Class code is required');
    }
    try {
      const response = await api.post('/student/classes/join', { classCode });
      return response.data;
    } catch (error) {
      console.error('Failed to join class:', error);
      throw error.response?.data || error.message;
    }
  },

  leaveClass: async (classId) => {
    if (!classId) {
      throw new Error('Class ID is required');
    }
    try {
      const response = await api.delete(`/student/classes/${classId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to leave class:', error);
      throw error.response?.data || error.message;
    }
  }
};

export default studentApi;