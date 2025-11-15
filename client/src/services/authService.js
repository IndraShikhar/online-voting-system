import api from '../api/api';

const authService = {
  async login({ username, email, password }) {
    const payload = {};
    if (email) payload.email = email;
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
};

export default authService;
