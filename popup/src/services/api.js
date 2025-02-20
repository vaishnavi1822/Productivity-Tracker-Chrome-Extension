const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for making authenticated requests
async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: (credentials) => 
    fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  register: (userData) => 
    fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
};

// Tracking API
export const trackingAPI = {
  saveTracking: (data) => 
    fetchWithAuth('/tracking/save', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getTracking: (startDate, endDate) => 
    fetchWithAuth(`/tracking/data?startDate=${startDate}&endDate=${endDate}`)
};

// Analytics API
export const analyticsAPI = {
  getComprehensive: (startDate, endDate) => 
    fetchWithAuth(`/analytics/comprehensive?startDate=${startDate}&endDate=${endDate}`),

  getHourlyPatterns: (startDate, endDate) => 
    fetchWithAuth(`/analytics/hourly-patterns?startDate=${startDate}&endDate=${endDate}`),

  getTrends: (startDate, endDate) => 
    fetchWithAuth(`/analytics/trends?startDate=${startDate}&endDate=${endDate}`),

  getInsights: (startDate, endDate) => 
    fetchWithAuth(`/analytics/insights?startDate=${startDate}&endDate=${endDate}`)
};

// Reports API
export const reportsAPI = {
  generateReport: (startDate, endDate) => 
    fetchWithAuth('/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ startDate, endDate })
    }),

  getReports: (startDate, endDate) => 
    fetchWithAuth(`/reports?startDate=${startDate}&endDate=${endDate}`)
}; 