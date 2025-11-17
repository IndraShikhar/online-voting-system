import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Calendar,
  Clock,
  UserCheck,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import axios from '../../api/api.js';
import AddnewCandidateForm from './AddnewCandidateForm.jsx';
import toast from 'react-hot-toast';

export default function CandidateManagement() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredElections, setFilteredElections] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    const filterElections = () => {
      let filtered = elections;

      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(
          (election) =>
            election.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            election.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            election.candidates?.some(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter((election) => election.status === statusFilter);
      }

      setFilteredElections(filtered);
    };

    filterElections();
  }, [elections, searchTerm, statusFilter]);

  async function loadAllData() {
    setLoading(true);
    try {
      const { data } = await axios.get('/elections');
      let electionsData = data.data.elections;

      // Filter elections that are not active
      electionsData = electionsData.filter(
        (ele) => ele.status === 'upcoming'
      );

      const electionWithCandidates = await Promise.all(
        electionsData.map(async (ele) => {
          try {
            const { data: res } = await axios.get(
              `/candidates/by-election/${ele.election_id}`
            );

            // If backend returns { status: "fail" }
            if (res.status === 'fail') {
              return {
                ...ele,
                candidates: [],
              };
            }

            return {
              ...ele,
              candidates: res.data || [],
            };
          } catch (error) {
            console.warn(
              `Failed to load candidates for election ${ele.election_id}`,
              error
            );

            // If API fails, return empty candidates
            return {
              ...ele,
              candidates: [],
            };
          }
        })
      );

      setElections(electionWithCandidates);
    } catch (error) {
      console.error('Failed to load elections:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveCandidate(candidate_id, candidateName) {
    if (!window.confirm(`Are you sure you want to remove ${candidateName} from this election?`)) return;

    try {
      await axios.delete(`/candidates/delete/${candidate_id}`);
      toast.success('Candidate removed successfully');
      setElections((prev) =>
        prev.map((ele) => ({
          ...ele,
          candidates: ele.candidates.filter(
            (c) => c.candidate_id !== candidate_id
          ),
        }))
      );
    } catch (error) {
      console.error('Failed to remove candidate:', error);
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: {
        label: 'Upcoming',
        color: 'bg-blue-600 text-white',
        icon: <Calendar className="w-3 h-3" />
      },
      active: {
        label: 'Active',
        color: 'bg-green-600 text-white',
        icon: <Clock className="w-3 h-3" />
      },
      ended: {
        label: 'Ended',
        color: 'bg-gray-600 text-white',
        icon: <CheckCircle className="w-3 h-3" />
      }
    };

    const config = statusConfig[status] || statusConfig.upcoming;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-700 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-neutral-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Candidate Management</h1>
            <p className="text-neutral-400">
              Manage candidates for upcoming elections
            </p>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={loadAllData}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <Link
              to="/admin/candidates/add"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Candidate
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search elections or candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Elections</option>
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="ended">Ended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Elections Grid */}
        {filteredElections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredElections.map((election) => (
              <div
                key={election.election_id}
                className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 hover:border-neutral-600 transition-colors"
              >
                {/* Election Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {election.title}
                    </h3>
                    <p className="text-neutral-400 text-sm mb-3 line-clamp-2">
                      {election.description}
                    </p>
                    {getStatusBadge(election.status)}
                  </div>
                </div>

                {/* Election Info
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-neutral-300">
                    <Calendar className="w-4 h-4 mr-2 text-neutral-400" />
                    <span>Start: {formatDate(election.start_time)}</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-300">
                    <Clock className="w-4 h-4 mr-2 text-neutral-400" />
                    <span>End: {formatDate(election.end_time)}</span>
                  </div>
                </div> */}

                {/* Candidates Section */}
                <div className="border-t border-neutral-700 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Candidates ({election.candidates.length})
                    </h4>
                  </div>

                  {election.candidates.length === 0 ? (
                    <div className="bg-neutral-700 rounded-lg p-4 text-center">
                      <UserCheck className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                      <p className="text-sm text-neutral-400">No candidates yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                      {election.candidates.map((candidate) => (
                        <div
                          key={candidate.candidate_id}
                          className="flex justify-between items-center bg-neutral-700 p-3 rounded-lg border border-neutral-600"
                        >
                          <div className="flex-1">
                            <span className="font-medium text-white block">
                              {candidate.name}
                            </span>
                            <span className="text-neutral-400 text-sm">
                              {candidate.party}
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemoveCandidate(candidate.candidate_id, candidate.name)}
                            className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Candidate Form */}
                  <div className="mt-4">
                    <AddnewCandidateForm election={election} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-12 text-center">
            <Users className="w-16 h-16 text-neutral-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No matching elections found' : 'No upcoming elections'}
            </h2>
            <p className="text-neutral-400 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Create an election first to start managing candidates'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link
                to="/admin/elections/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Election
              </Link>
            )}
          </div>
        )}

        {/* Results Summary */}
        {filteredElections.length > 0 && (
          <div className="mt-8 flex items-center justify-between text-neutral-400">
            <span className="text-sm">
              Showing {filteredElections.length} of {elections.length} elections
            </span>
            <span className="text-sm">
              Total candidates: {filteredElections.reduce((sum, e) => sum + e.candidates.length, 0)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
