// store/index.ts
import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    role: 'none',
    email: '',
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    setUser(token: string, role: string, email: string) {
      this.token = token;
      this.role = role;
      this.email = email;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
    logout() {
      this.token = '';
      this.role = 'none';
      this.email = '';
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    },
    async fetchUserFromToken() {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        this.token = token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const res = await axios.get('http://localhost:3001/api/auth/me');
        this.email = res.data.email;
        this.role = res.data.role;
      } catch (err) {
        console.error('⛔ Token är ogiltig eller utgången:', err);
        this.logout(); // token funkar inte
      }
    }
  }
});
