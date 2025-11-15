import axios from '../api/api.js';

export async function getCandidates() {
  const { data } = await axios.get('/candidates');
  return data;
}

export default {
  getCandidates,
};
