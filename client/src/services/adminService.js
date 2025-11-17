import api from '../api/api';

// Admin Dashboard Service - Simplified to match actual backend routes
const adminService = {
  // Dashboard Stats (calculated from existing endpoints)
  getDashboardStats: async () => {
    try {
      const [
        electionsResponse,
        usersResponse,
        candidatesResponse,
        turnoutResponse,
      ] = await Promise.all([
        api.get('/elections'),
        api.get('/users/all'),
        api.get('/candidates'),
        api.get('/votes/turnout'),
      ]);

      const elections = electionsResponse.data?.data.elections || [];
      const users = usersResponse.data?.data.users || [];
      const candidates = candidatesResponse.data?.data || [];
      const turnout = turnoutResponse.data?.data.totalVoterTurnout || 0;

      // Calculate stats from actual data
      const activeElections = elections.filter(
        (e) => e.status === 'active'
      ).length;
      const completedElections = elections.filter(
        (e) => e.status === 'ended'
      ).length;
      const pendingElections = elections.filter(
        (e) => e.status === 'upcoming'
      ).length;

      return {
        totalElections: elections.length,
        totalVoters: users.filter((u) => u.role === 'voter').length,
        totalCandidates: candidates.length,
        totalVotes: 0, // Would need vote count from results
        activeElections,
        completedElections,
        pendingElections,
        voterTurnout: turnout,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalElections: 0,
        totalVoters: 0,
        totalCandidates: 0,
        totalVotes: 0,
        activeElections: 0,
        completedElections: 0,
        pendingElections: 0,
        voterTurnout: 0,
      };
    }
  },

  // Recent Activity (mock data for now)
  getRecentActivity: async () => {
    try {
      // Since there's no activity endpoint, return mock data
      return [
        {
          id: 1,
          description: 'New election created',
          timestamp: new Date().toISOString(),
        },
        {
          id: 2,
          description: 'Candidate added',
          timestamp: new Date().toISOString(),
        },
        {
          id: 3,
          description: 'Voter registered',
          timestamp: new Date().toISOString(),
        },
      ];
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  },

  // Elections Management
  getRecentElections: async (limit = 3) => {
    try {
      const response = await api.get('/elections');
      const elections = response.data?.data.elections || [];
      return elections.slice(0, limit);
    } catch (error) {
      console.error('Error fetching recent elections:', error);
      return [];
    }
  },

  getAllElections: async () => {
    try {
      const {
        data: { data },
      } = await api.get('/elections');
      return data.elections;
    } catch (error) {
      console.error('Error fetching elections:', error);
      return { data: [] };
    }
  },

  getElectionDetails: async (id) => {
    try {
      const response = await api.get(`/elections/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching election details:', error);
      throw error;
    }
  },

  createElection: async (electionData) => {
    try {
      const response = await api.post('/elections/create', electionData);
      return response.data;
    } catch (error) {
      console.error('Error creating election:', error);
      throw error;
    }
  },

  deleteElection: async (id) => {
    try {
      const response = await api.delete(`/elections/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting election:', error);
      throw error;
    }
  },

  startElection: async (id) => {
    try {
      const response = await api.patch(`/elections/start/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error starting election:', error);
      throw error;
    }
  },

  endElection: async (id) => {
    try {
      const response = await api.patch(`/elections/end/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error ending election:', error);
      throw error;
    }
  },

  declareResults: async (id) => {
    try {
      const response = await api.patch(`/elections/declare-result/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error declaring results:', error);
      throw error;
    }
  },

  // Candidate Management
  getAllCandidates: async () => {
    try {
      const response = await api.get('/candidates');
      return response.data;
    } catch (error) {
      console.error('Error fetching candidates:', error);
      return { data: [] };
    }
  },

  getCandidateDetails: async (id) => {
    try {
      const response = await api.get(`/candidates/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      throw error;
    }
  },

  getCandidatesByElection: async (electionId) => {
    try {
      const {
        data: { data },
      } = await api.get(`/candidates/by-election/${electionId}`);
      return data;
    } catch (error) {
      console.error('Error fetching election candidates:', error);
      return { data: [] };
    }
  },

  getVotesByElection: async (electionId) => {
    try {
      const {
        data: { data },
      } = await api.get(`/votes/by-election/${electionId}`);
      return data.votes;
    } catch (error) {
      console.error('Error fetching election votes:', error);
      return { data: [] };
    }
  },

  createCandidate: async (candidateData) => {
    try {
      const response = await api.post('/candidates/add', candidateData);
      return response.data;
    } catch (error) {
      console.error('Error creating candidate:', error);
      throw error;
    }
  },

  updateCandidate: async (id, candidateData) => {
    try {
      const response = await api.put(`/candidates/update/${id}`, candidateData);
      return response.data;
    } catch (error) {
      console.error('Error updating candidate:', error);
      throw error;
    }
  },

  deleteCandidate: async (id) => {
    try {
      const response = await api.delete(`/candidates/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting candidate:', error);
      throw error;
    }
  },

  // User/Voter Management
  getAllUsers: async () => {
    try {
      const response = await api.get('/users/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return { data: [] };
    }
  },

  blockUser: async (userId) => {
    try {
      const response = await api.patch(`/users/block/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  },

  unblockUser: async (userId) => {
    try {
      const response = await api.patch(`/users/unblock/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error unblocking user:', error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/delete/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Results Management
  getElectionResults: async (electionId) => {
    try {
      const {
        data: { data },
      } = await api.get(`/elections/results/${electionId}`);
      console.log('res', data);
      return data.candidates;
    } catch (error) {
      console.error('Error fetching election results:', error);
      return null;
    }
  },

  // Vote Management
  getVoteResults: async (electionId) => {
    try {
      const response = await api.get(`/votes/results/${electionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vote results:', error);
      return null;
    }
  },

  getVoteCounts: async (electionId) => {
    try {
      const response = await api.get(`/votes/count/${electionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vote counts:', error);
      return null;
    }
  },

  // Profile Management
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return {};
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
};

export default adminService;
