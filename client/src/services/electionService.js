import axios from '../api/api.js';

export async function getStats() {
  const { data } = await axios.get('/dashboard/stats');
  return data;
}

export async function getElections() {
  const { data } = await axios.get('/elections');
  return data;
}

export default {
  getStats,
  getElections,
};
