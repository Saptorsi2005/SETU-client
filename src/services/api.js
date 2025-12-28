import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if needed
      // window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Register user (student or alumni)
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user (student or alumni)
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },
};

// Admin API calls
export const adminAPI = {
  // Admin login
  login: async (credentials) => {
    const response = await api.post('/admin/login', credentials);
    return response.data;
  },

  // Get admin profile
  getProfile: async () => {
    const response = await api.get('/admin/profile');
    return response.data;
  },

  // Get all users
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Create new admin
  createAdmin: async (adminData) => {
    const response = await api.post('/admin/create', adminData);
    return response.data;
  },
};

// Events API calls
export const eventsAPI = {
  // Get all events
  getAll: async (params = {}) => {
    const response = await api.get('/events', { params });
    return response.data;
  },

  // Get event by ID
  getById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Create event (admin and alumni only)
  create: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  // Update event (organizer only)
  update: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  // Delete event (organizer only)
  delete: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  // Register for event (students only)
  register: async (id, registrationData) => {
    const response = await api.post(`/events/${id}/register`, registrationData);
    return response.data;
  },

  // Get my registrations (students only)
  getMyRegistrations: async () => {
    const response = await api.get('/events/my/registrations');
    return response.data;
  },
};

export default api;
