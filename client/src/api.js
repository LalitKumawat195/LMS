// API utility functions for database operations
const API_BASE = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.token;
};

// API headers with auth
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

// Events API
export const eventsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/events`, {
      headers: getHeaders()
    });
    return response.json();
  },

  create: async (eventData) => {
    const response = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(eventData)
    });
    return response.json();
  },

  update: async (id, eventData) => {
    const response = await fetch(`${API_BASE}/events/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(eventData)
    });
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE}/events/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return response.json();
  }
};

// Notices API
export const noticesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/notices`, {
      headers: getHeaders()
    });
    return response.json();
  },

  create: async (noticeData) => {
    const response = await fetch(`${API_BASE}/notices`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(noticeData)
    });
    return response.json();
  },

  update: async (id, noticeData) => {
    const response = await fetch(`${API_BASE}/notices/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(noticeData)
    });
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE}/notices/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return response.json();
  },

  togglePin: async (id) => {
    const response = await fetch(`${API_BASE}/notices/${id}/pin`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    return response.json();
  },

  incrementViews: async (id) => {
    const response = await fetch(`${API_BASE}/notices/${id}/view`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    return response.json();
  }
};

// Notifications API
export const notificationsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/notifications`, {
      headers: getHeaders()
    });
    return response.json();
  },

  markAsRead: async (id) => {
    const response = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    return response.json();
  },

  markAllAsRead: async () => {
    const response = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE}/notifications/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return response.json();
  }
};