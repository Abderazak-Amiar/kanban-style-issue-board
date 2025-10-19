import { create } from 'zustand';
import type { AuthState } from '../types';
import { currentUser } from '../utils/api';

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated:
    JSON.parse(localStorage.getItem('userData') || '{}').isAuthenticated ||
    false,
  username:
    JSON.parse(localStorage.getItem('userData') || '{}').username || null,
  role: JSON.parse(localStorage.getItem('userData') || '{}').role || null,

  login: (username: string, role: string) => {
    if (
      username === currentUser.username &&
      (role === 'admin' || role === 'contributor')
    ) {
      set({ username, isAuthenticated: true, role });
      const userData = JSON.stringify({
        username,
        role,
        isAuthenticated: true,
      });
      localStorage.setItem('userData', userData);

      return true;
    }
    return false;
  },

  logout: () => {
    set({ username: undefined, isAuthenticated: false, role: null });
    localStorage.removeItem('userData');
  },
}));
