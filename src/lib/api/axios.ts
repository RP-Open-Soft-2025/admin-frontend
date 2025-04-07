import axios from 'axios';
import { logout } from '@/redux/features/auth';
import { API_URL } from '@/constants';

// Create API instance
const api = axios.create({
  baseURL: API_URL,
});

// Ensure we're only running on client side before accessing store
if (typeof window !== 'undefined') {
  // Request interceptor to add auth token to all requests
  api.interceptors.request.use(
    async (config) => {
      // Dynamically import store to avoid SSR issues
      const { default: store } = await import('@/redux/store');
      const { auth } = store.getState();
      const token = auth.user?.accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor to handle 403 errors
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Handle 403 Forbidden responses
      if (error.response && error.response.status === 403) {
        console.log('Received 403 forbidden response - logging out');
        
        // Dynamically import store to avoid SSR issues
        const { default: store } = await import('@/redux/store');
        
        // Dispatch logout action to clear token
        store.dispatch(logout());
        
        // Redirect to login page
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }
  );
}

export default api; 