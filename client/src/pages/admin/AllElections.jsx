import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Play,
  Square,
  BarChart3,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Eye,
  Settings
} from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const AllElections = () => {
  const [elections, setElections] = useState([]);
  const [filteredElections, setFilteredElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedElection, setSelectedElection] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadElections();
  }, []);

  useEffect(() => {
    filterElections();
  }, [elections, searchTerm, statusFilter]);

  const loadElections = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllElections();
      await Promise.all(response.map(async (election) => {
        const candidate_count = (await adminService.getCandidatesByElection(election.election_id)).length;
        const vote_count = await adminService.getVotesByElection(election.election_id);

        election.candidate_count = candidate_count;
        election.vote_count = vote_count;
      }));
      const electionsData = response || [];
      toast.success('Elections loaded successfully');
      setElections(electionsData);
    } catch (error) {
      console.error('Failed to load elections:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterElections = () => {
    let filtered = elections;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(election =>
        election.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        election.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(election => {
        const status = getElectionStatus(election);
        return status === statusFilter;
      });
    }

    // Sort by creation date(newest first)
    filtered = filtered.sort((a, b) =>
      new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt)
    );

    setFilteredElections(filtered);
  };

  const getElectionStatus = (election) => {
    const { status } = election;
    return status;
  };

  const getStatusDisplay = (status) => {
    const statusConfig = {
      active: {
        label: 'Active',
        color: 'bg-green-600 text-white',
        icon: <Play className="w-3 h-3" />
      },
      upcoming: {
        label: 'Upcoming',
        color: 'bg-blue-600 text-white',
        icon: <Clock className="w-3 h-3" />
      },
      ended: {
        label: 'Ended',
        color: 'bg-yellow-600 text-white',
        icon: <Square className="w-3 h-3" />
      },
      result_declared: {
        label: 'Completed',
        color: 'bg-gray-600 text-white',
        icon: <CheckCircle className="w-3 h-3" />
      }
    };

    return statusConfig[status] || statusConfig.upcoming;
  };

  const handleStartElection = async (election) => {
    setActionLoading(true);
    try {
      await adminService.startElection(election.election_id);
      await loadElections();
      // Show success message
    } catch (error) {
      console.error('Failed to start election:', error);
      // Show error message
    } finally {
      setActionLoading(false);
    }
  };

  const handleEndElection = async (election) => {
    setActionLoading(true);
    try {
      await adminService.endElection(election.election_id);
      await loadElections();
      // Show success message
    } catch (error) {
      console.error('Failed to end election:', error);
      // Show error message
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeclareResults = async (election) => {
    setActionLoading(true);
    try {
      await adminService.declareResults(election.election_id);
      await loadElections();
      // Show success message
    } catch (error) {
      console.error('Failed to declare results:', error);
      // Show error message
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteElection = async () => {
    if (!selectedElection) return;

    setActionLoading(true);
    try {
      await adminService.deleteElection(selectedElection.election_id);
      await loadElections();
      setShowDeleteModal(false);
      setSelectedElection(null);
      // Show success message
    } catch (error) {
      console.error('Failed to delete election:', error);
      // Show error message
    } finally {
      setActionLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ElectionCard = ({ election }) => {
    const status = getElectionStatus(election);
    const statusDisplay = getStatusDisplay(status);
    const [showActions, setShowActions] = useState(false);

    return (
      <div className="bg-neutral-800 rounded-xl border border-neutral-700 hover:border-neutral-600 transition-all duration-200 overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusDisplay.color}`}>
                  {statusDisplay.icon}
                  {statusDisplay.label}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{election.title}</h3>
              <p className="text-neutral-400 text-sm mb-3 line-clamp-2">
                {election.description || 'No description available'}
              </p>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
              >
                <MoreHorizontal className="w-5 h-5 text-neutral-400" />
              </button>

              {showActions && (
                <div className="absolute right-0 top-full mt-1 bg-neutral-700 rounded-lg border border-neutral-600 py-1 min-w-48 z-10">
                  <Link
                    to={`/admin/elections/${election.election_id}`}
                    className="flex items-center px-3 py-2 text-sm text-white hover:bg-neutral-600 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Link>
                  <Link
                    to={`/admin/elections/${election.election_id}/edit`}
                    className="flex items-center px-3 py-2 text-sm text-white hover:bg-neutral-600 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Election
                  </Link>

                  {status === 'upcoming' && (
                    <button
                      onClick={() => handleStartElection(election)}
                      disabled={actionLoading}
                      className="flex items-center px-3 py-2 text-sm text-green-400 hover:bg-neutral-600 transition-colors w-full text-left"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Election
                    </button>
                  )}

                  {status === 'active' && (
                    <button
                      onClick={() => handleEndElection(election)}
                      disabled={actionLoading}
                      className="flex items-center px-3 py-2 text-sm text-yellow-400 hover:bg-neutral-600 transition-colors w-full text-left"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      End Election
                    </button>
                  )}

                  {status === 'ended' && !election.results_declared && (
                    <button
                      onClick={() => handleDeclareResults(election)}
                      disabled={actionLoading}
                      className="flex items-center px-3 py-2 text-sm text-blue-400 hover:bg-neutral-600 transition-colors w-full text-left"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Declare Results
                    </button>
                  )}

                  <hr className="border-neutral-600 my-1" />

                  <button
                    onClick={() => {
                      setSelectedElection(election);
                      setShowDeleteModal(true);
                      setShowActions(false);
                    }}
                    className="flex items-center px-3 py-2 text-sm text-red-400 hover:bg-neutral-600 transition-colors w-full text-left"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Election
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Election Info */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-white">{election.candidate_count || 0}</div>
              <div className="text-xs text-neutral-400">Candidates</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">{election.vote_count || 0}</div>
              <div className="text-xs text-neutral-400">Votes Cast</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">{election.voter_count || 0}</div>
              <div className="text-xs text-neutral-400">Eligible Voters</div>
            </div>
          </div>

          {/* Timeline */}
          {/* <div className="space-y-2 text-sm">
            <div className="flex items-center text-neutral-300">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-neutral-400">Start:</span>
              <span className="ml-2">{formatDateTime(election.start_time)}</span>
            </div>
            <div className="flex items-center text-neutral-300">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-neutral-400">End:</span>
              <span className="ml-2">{formatDateTime(election.end_time)}</span>
            </div>
          </div> */}

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-700">
            <Link
              to={`/admin/elections/${election.election_id}`}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              View
            </Link>

            {status === 'active' || status === 'completed' ? (
              <Link
                to={`/admin/results/${election.election_id}`}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                Results
              </Link>
            ) : null}

            <Link
              to={`/admin/candidates?election=${election.election_id}`}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Users className="w-4 h-4" />
              Candidates
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-700 rounded w-64 mb-8"></div>
            <div className="h-16 bg-neutral-700 rounded mb-6"></div>
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">All Elections</h1>
            <p className="text-neutral-400">
              Manage and monitor all elections in the system
            </p>
          </div>
          <Link
            to="/admin/elections/create"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Election
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search elections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer min-w-40"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="ended">Ended</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Elections Grid */}
        {filteredElections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredElections.map((election) => (
              <ElectionCard key={election.election_id} election={election} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            {elections.length === 0 ? (
              <>
                <AlertCircle className="w-16 h-16 text-neutral-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-neutral-300 mb-2">
                  No Elections Created Yet
                </h3>
                <p className="text-neutral-500 mb-6">
                  Get started by creating your first election
                </p>
                <Link
                  to="/admin/elections/create"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Create First Election
                </Link>
              </>
            ) : (
              <>
                <Search className="w-16 h-16 text-neutral-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-neutral-300 mb-2">
                  No Elections Match Your Search
                </h3>
                <p className="text-neutral-500 mb-4">
                  Try adjusting your search terms or filters
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="px-6 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </>
            )}
          </div>
        )}

        {/* Stats Summary */}
        {elections.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 text-center">
              <div className="p-3 bg-blue-600 rounded-lg w-fit mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">{elections.length}</div>
              <div className="text-neutral-400 text-sm">Total Elections</div>
            </div>

            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 text-center">
              <div className="p-3 bg-green-600 rounded-lg w-fit mx-auto mb-3">
                <Play className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                {elections.filter(e => getElectionStatus(e) === 'active').length}
              </div>
              <div className="text-neutral-400 text-sm">Active Elections</div>
            </div>

            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 text-center">
              <div className="p-3 bg-yellow-600 rounded-lg w-fit mx-auto mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                {elections.filter(e => getElectionStatus(e) === 'upcoming').length}
              </div>
              <div className="text-neutral-400 text-sm">Upcoming Elections</div>
            </div>

            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 text-center">
              <div className="p-3 bg-gray-600 rounded-lg w-fit mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                {elections.filter(e => getElectionStatus(e) === 'completed').length}
              </div>
              <div className="text-neutral-400 text-sm">Completed Elections</div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedElection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-600 rounded-lg mr-4">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Delete Election</h3>
                <p className="text-neutral-400 text-sm">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-neutral-300 mb-6">
              Are you sure you want to delete "<strong>{selectedElection.title}</strong>"?
              This will permanently remove the election and all associated data.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedElection(null);
                }}
                className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteElection}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Delete Election'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllElections;
