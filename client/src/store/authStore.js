import { create } from 'zustand';
import api from '../services/api';
import { initSocket, disconnectSocket } from '../services/socket';

const getStoredAuth = () => {
  try {
    const item = localStorage.getItem('ccms_auth');
    return item ? JSON.parse(item) : { user: null, token: null };
  } catch {
    return { user: null, token: null };
  }
};

export const useAuthStore = create((set, get) => ({
  user: getStoredAuth().user,
  token: getStoredAuth().token,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, token } = res.data;
      localStorage.setItem('ccms_auth', JSON.stringify({ user, token }));
      set({ user, token, isLoading: false });
      initSocket(token);
      return user;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { user, token } = res.data;
      localStorage.setItem('ccms_auth', JSON.stringify({ user, token }));
      set({ user, token, isLoading: false });
      initSocket(token);
      return user;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  fetchMe: async () => {
    try {
      const res = await api.get('/auth/me');
      const user = res.data;
      const token = get().token;
      localStorage.setItem('ccms_auth', JSON.stringify({ user, token }));
      set({ user });
      return user;
    } catch (err) {
      console.warn('Failed to fetch user profile:', err);
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put('/auth/profile', data);
      const updatedUser = res.data;
      const token = get().token;
      localStorage.setItem('ccms_auth', JSON.stringify({ user: updatedUser, token }));
      set({ user: updatedUser, isLoading: false });
      return updatedUser;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('ccms_auth');
    disconnectSocket();
    set({ user: null, token: null, error: null });
  },

  clearError: () => set({ error: null }),
}));
