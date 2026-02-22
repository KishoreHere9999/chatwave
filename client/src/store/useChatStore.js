import { create } from 'zustand';
import axiosInstance from '../lib/axios.js';
import { getSocket } from '../lib/socket.js';

const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  rooms: [],
  selectedUser: null,
  selectedRoom: null,
  isLoading: false,

  // Get all users for sidebar
  getUsers: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/messages/users');
      set({ users: res.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  // Get DM messages
  getMessages: async (userId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  // Send DM
  sendMessage: async (userId, data) => {
    try {
      const res = await axiosInstance.post(`/messages/send/${userId}`, data);
      const socket = getSocket();
      if (socket) {
        socket.emit('sendMessage', {
          message: res.data,
          receiverId: userId,
        });
      }
      set((state) => ({ messages: [...state.messages, res.data] }));
    } catch (error) {
      console.log(error);
    }
  },

  // Get rooms
  getRooms: async () => {
    try {
      const res = await axiosInstance.get('/rooms');
      set({ rooms: res.data });
    } catch (error) {
      console.log(error);
    }
  },

  // Get room messages
  getRoomMessages: async (roomId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/rooms/${roomId}/messages`);
      set({ messages: res.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  // Send room message
  sendRoomMessage: async (roomId, data) => {
    try {
      const res = await axiosInstance.post(`/messages/send/${roomId}`, data);
      const socket = getSocket();
      if (socket) {
        socket.emit('sendRoomMessage', {
          message: res.data,
          roomId,
        });
      }
      set((state) => ({ messages: [...state.messages, res.data] }));
    } catch (error) {
      console.log(error);
    }
  },

  // Listen for new messages
  listenForMessages: () => {
    const socket = getSocket();
    if (!socket) return;

    socket.on('newMessage', (message) => {
      set((state) => ({ messages: [...state.messages, message] }));
    });

    socket.on('newRoomMessage', (message) => {
      set((state) => ({ messages: [...state.messages, message] }));
    });
  },

  // Set selected user
  setSelectedUser: (user) => set({ 
    selectedUser: user, 
    selectedRoom: null, 
    messages: [] 
  }),

  // Set selected room
  setSelectedRoom: (room) => set({ 
    selectedRoom: room, 
    selectedUser: null, 
    messages: [] 
  }),
}));

export default useChatStore;