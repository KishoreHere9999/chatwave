import { create } from 'zustand';
import axiosInstance from '../lib/axios.js';
import { initSocket, disconnectSocket } from '../lib/socket.js';

const useAuthStore = create((set) => ({
  authUser: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,
  onlineUsers: [],

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post('/auth/register', data);
      localStorage.setItem('token', res.data.token);
      const socket = initSocket(res.data._id);
      set({ 
        authUser: res.data, 
        token: res.data.token,
        isLoading: false 
      });
      socket.on('getOnlineUsers', (users) => {
        set({ onlineUsers: users });
      });
      return res.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Registration failed',
        isLoading: false 
      });
      throw error;
    }
  },

  login: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post('/auth/login', data);
      localStorage.setItem('token', res.data.token);
      const socket = initSocket(res.data._id);
      set({ 
        authUser: res.data, 
        token: res.data.token,
        isLoading: false 
      });
      socket.on('getOnlineUsers', (users) => {
        set({ onlineUsers: users });
      });
      return res.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Login failed',
        isLoading: false 
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    disconnectSocket();
    set({ authUser: null, token: null, onlineUsers: [] });
  },

  getMe: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/auth/me');
      const socket = initSocket(res.data._id);
      set({ authUser: res.data, isLoading: false });
      socket.on('getOnlineUsers', (users) => {
        set({ onlineUsers: users });
      });
    } catch (error) {
      set({ authUser: null, isLoading: false });
    }
  },
}));

export default useAuthStore;