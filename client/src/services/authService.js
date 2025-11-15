import api from '../api/api';

const authService = {
  async login({ username, password }) {
    const payload = {};
    if (username) payload.username = username;
    payload.password = password;

    const res = await api.post('/users/login', payload);
    return res.data; // { status, token, data: { user } }
  },

  async register({ username, name, email, password }) {
    const res = await api.post('/users/register', {
      username,
      name,
      email,
      password,
    });
    return res.data;
  },

  async getProfile() {
    const res = await api.get('/users/profile');
    return res.data;
  },
  async logout() {
    const res = await api.post('/users/logout');
    return res.data;
  },
};

export default authService;
