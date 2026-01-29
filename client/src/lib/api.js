import axios from 'axios';

// Create a centralized Axios instance
// This enhances maintainability by defining the Base URL and default headers in one place.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (
        window.location.hostname === 'localhost' 
            ? 'http://localhost:5000' 
            : '/api'
    ),
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Request Interceptor: Automatically attach token
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

// Response Interceptor: Handle common errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Network error (server not reachable)
        if (!error.response) {
            console.error('Network Error: Unable to reach server');
            error.message = 'Unable to connect to server. Please ensure the backend is running.';
        }
        
        // Token expired or invalid
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.warn('Authentication failed - clearing session');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Only redirect if not already on login page
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        // Server error
        if (error.response?.status >= 500) {
            console.error('Server Error:', error.response.data);
            error.message = 'Server error. Please try again later.';
        }

        return Promise.reject(error);
    }
);

export default api;
