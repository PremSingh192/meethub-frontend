import axios from 'axios';
import { User, LoginResponse, OTPRequest, OTPVerify } from '@/types';
import { useAuthStore } from '@/store/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for JWT token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Use auth store instead of direct localStorage access
    const authState = useAuthStore.getState();
    const token = authState.token;
    
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    console.log('Auth state token:', token ? token.substring(0, 20) + '...' : 'null');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Bearer token attached to request:', token.substring(0, 20) + '...');
      console.log('Full Authorization header:', config.headers.Authorization);
    } else {
      console.log('No token found in auth store');
    }
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.method?.toUpperCase(), response.config.url, response.status);
    return response;
  },
  (error) => {
    console.log('API Error:', error.config?.method?.toUpperCase(), error.config?.url, error.response?.status);
    console.log('Error request headers:', error.config?.headers);
    
    if (error.response?.status === 401) {
      console.log('401 Error - Token might be invalid or expired');
      if (typeof window !== 'undefined') {
        // Use auth store instead of direct localStorage access
        const authStore = useAuthStore.getState();
        console.log('Current auth store state before logout:', {
          token: authStore.token?.substring(0, 20) + '...',
          isAuthenticated: authStore.isAuthenticated,
          user: authStore.user
        });
        
        authStore.logout();
        // Redirect to login page
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  sendOTP: (email: string) => api.post<OTPRequest>('/api/auth/send-otp', { email }),
  verifyOTP: (email: string, otp: string) => 
    api.post<LoginResponse>('/api/auth/verify-otp', { email, otp }),
  getProfile: () => api.get<User>('/api/auth/profile'),
};

export const meetingAPI = {
  createRoom: (title: string, password?: string) => 
    api.post('/api/meetings/rooms', { title, password }),
  getRoom: (roomCode: string) => api.get(`/api/meetings/rooms/${roomCode}`),
  joinRoom: (roomCode: string, password?: string) => 
    api.post('/api/meetings/join', { room_code: roomCode, password }),
  leaveRoom: (roomCode: string) => api.post(`/api/meetings/leave/${roomCode}`),
  getParticipants: (roomId: string) => 
    api.get(`/api/meetings/rooms/${roomId}/participants`),
  getChatHistory: (roomId: string, limit = 50) => 
    api.get(`/api/meetings/rooms/${roomId}/chat?limit=${limit}`),
  getUserRooms: () => api.get('/api/meetings/my-rooms'),
};
