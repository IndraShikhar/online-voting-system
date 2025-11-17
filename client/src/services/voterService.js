import api from '../api/api.js';

const voterService = {
  // Get voter dashboard stats
  async getVoterStats() {
    try {
      const {
        data: { data },
      } = await api.get('/votes/my-stats');
      console.log(data);
      return data;
    } catch (error) {
      console.error('Failed to load voter stats:', error);
      return {
        totalElections: 0,
        votedElections: 0,
        upcomingElections: 0,
        completedElections: 0,
      };
    }
  },

  // Get elections available for voting
  async getAvailableElections() {
    try {
      const {
        data: { data },
      } = await api.get('/elections');

      return Array.isArray(data) ? data : data?.elections || [];
    } catch (error) {
      console.error('Failed to load elections:', error);
      return [];
    }
  },

  // Get election details
  async getElectionDetails(electionId) {
    try {
      const {
        data: { data },
      } = await api.get(`/elections/${electionId}`);
      return data.election;
    } catch (error) {
      console.error('Failed to load election details:', error);
      throw error;
    }
  },

  // Get candidates for an election
  async getElectionCandidates(electionId) {
    try {
      const {
        data: { data },
      } = await api.get(`/candidates/by-election/${electionId}`);
      console.log('election', data);
      return Array.isArray(data) ? data : data?.candidates || [];
    } catch (error) {
      console.error('Failed to load candidates:', error);
      return [];
    }
  },

  // Cast vote
  async castVote(electionId, candidateId) {
    try {
      const { data } = await api.post('/votes/cast', {
        election_id: electionId,
        candidate_id: candidateId,
      });
      return data;
    } catch (error) {
      console.error('Failed to cast vote:', error);
      throw error;
    }
  },

  // Check if user has voted in an election
  async hasVoted(electionId) {
    try {
      const {
        data: { data },
      } = await api.get(`/votes/status/${electionId}`);
      return data.hasVoted || false;
    } catch (error) {
      console.error('Failed to check vote status:', error);
      return false;
    }
  },

  // Get elections with declared results
  async getElectionsWithResults() {
    try {
      let {
        data: {
          data: { elections },
        },
      } = await api.get('/elections');
      elections = elections.filter(
        (election) => election.status === 'result_declared'
      );
      console.log('result', elections);
      return Array.isArray(elections) ? elections : elections?.elections || [];
    } catch (error) {
      console.error('Failed to load elections with results:', error);
      return [];
    }
  },

  // Get election results
  async getElectionResults(electionId) {
    try {
      const {
        data: { data },
      } = await api.get(`/elections/results/${electionId}`);
      console.log(data);
      return data;
    } catch (error) {
      console.error('Failed to load results:', error);
      throw error;
    }
  },

  // Update voter profile
  async updateProfile(profileData) {
    try {
      const { data } = await api.put('/users/profile', profileData);
      return data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  },
};

export default voterService;
