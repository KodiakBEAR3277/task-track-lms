import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

// Add request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Using token:', token);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.config?.headers
    });
    throw error;
  }
);

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
  },

  getClassModules: async (classId) => {
    try {
      const response = await api.get(`/teacher/classes/${classId}/modules`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch class modules:', error);
      throw error.response?.data || error.message;
    }
  },

  getClassStudents: async (classId) => {
    try {
      const response = await api.get(`/teacher/classes/${classId}/students`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch class students:', error);
      throw error.response?.data || error.message;
    }
  },

  createModule: async (classId, moduleData) => {
    try {
      const response = await api.post(`/teacher/classes/${classId}/modules`, moduleData);
      return response.data;
    } catch (error) {
      console.error('Failed to create module:', error);
      throw error.response?.data || error.message;
    }
  },

  createModuleContent: async (classId, moduleId, contentData) => {
    try {
      const formData = new FormData();
      
      // Append basic content data
      Object.keys(contentData).forEach(key => {
        if (contentData[key] !== null && contentData[key] !== undefined) {
          formData.append(key, contentData[key]);
        }
      });

      // Handle file attachment if present
      if (contentData.file) {
        formData.append('file', contentData.file);
      }

      const response = await api.post(
        `/teacher/classes/${classId}/modules/${moduleId}/content`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to create module content:', error);
      throw error.response?.data || error.message;
    }
  },

  getModuleContent: async (classId, moduleId, contentId) => {
    try {
      const response = await api.get(
        `/teacher/classes/${classId}/modules/${moduleId}/content/${contentId}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch module content:', error);
      throw error.response?.data || error.message;
    }
  },

  getModuleContents: async (classId, moduleId) => {
    try {
      const response = await api.get(`/teacher/classes/${classId}/modules/${moduleId}/contents`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch module contents:', error);
      throw error.response?.data || error.message;
    }
  },

  updateClassModule: async (classId, moduleId, updates) => {
    try {
      const response = await api.patch(
        `/teacher/classes/${classId}/modules/${moduleId}`,
        updates
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update module:', error);
      throw error.response?.data || error.message;
    }
  },

  deleteModuleContent: async (classId, moduleId, contentId) => {
    try {
      const response = await api.delete(
        `/teacher/classes/${classId}/modules/${moduleId}/content/${contentId}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to delete content:', error);
      throw error.response?.data || error.message;
    }
  },

  deleteModule: async (classId, moduleId) => {
    try {
      const response = await api.delete(`/teacher/classes/${classId}/modules/${moduleId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete module:', error);
      throw error.response?.data || error.message;
    }
  },

  deleteClass: async (classId) => {
    try {
      console.log('Attempting to delete class:', classId);
      const response = await api.delete(`/teacher/classes/${classId}`);
      console.log('Delete class response:', response);
      return response.data;
    } catch (error) {
      console.error('Delete class error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error.response?.data || error.message;
    }
  }
};

export default teacherApi;