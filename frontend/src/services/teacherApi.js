import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const teacherApi = {
  getClasses: async () => {
    try {
      const response = await api.get('/teacher/classes');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      throw error.response?.data || error.message;
    }
  },

  createClass: async (classData) => {
    try {
      const response = await api.post('/teacher/classes', classData);
      return response.data;
    } catch (error) {
      console.error('Failed to create class:', error);
      throw error.response?.data || error.message;
    }
  },

  getClassDetails: async (classId) => {
    try {
      const response = await api.get(`/teacher/classes/${classId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch class details:', error);
      throw error.response?.data || error.message;
    }
  }
};

export default teacherApi;