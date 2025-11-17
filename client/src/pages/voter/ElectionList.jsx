import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Users, Vote, CheckCircle, Clock, Filter } from 'lucide-react';
import voterService from '../../services/voterService';
import toast from 'react-hot-toast';

const ElectionList = () => {
  const [elections, setElections] = useState([]);
  const [filteredElections, setFilteredElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [votedStatus, setVotedStatus] = useState({});

  useEffect(() => {
    loadElections();
  }, []);

  useEffect(() => {
    filterElections();
  }, [elections, searchTerm, statusFilter]);

  const loadElections = async () => {
    setLoading(true);
    try {
      const data = await voterService.getAvailableElections();
      setElections(data);
      toast.success('Elections loaded successfully');
      // Check voting status for each election
      const statusPromises = data.map(async (election) => {
        try {
          const hasVoted = await voterService.hasVoted(election.election_id);
          return { [election.election_id]: hasVoted };
        } catch {
          return { [election.election_id]: false };
        }
      });

      const statuses = await Promise.all(statusPromises);
      const votedStatusMap = statuses.reduce((acc, status) => ({ ...acc, ...status }), {});
      setVotedStatus(votedStatusMap);
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
        election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (election.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(election => {
        const status = getElectionStatus(election).status;
        return status === statusFilter;
      });
    }

    setFilteredElections(filtered);
  };
  const getElectionStatus = function (election) {
    const { status } = election;
    let label = '', color = '';
    if (status === 'active') {
      label = 'Active';
      color = 'green';
    } else if (status === 'upcoming') {
      label = 'Upcoming';
      color = 'yellow';
    } else if (status === 'ended') {
      label = 'Ended';
      color = 'gray';
    } else if (status === 'result_declared') {
      label = 'Result Declared';
      color = 'blue';
    }
    return { status, label, color };
  };

  const ElectionCard = ({ election }) => {
    const { status, label, color } = getElectionStatus(election);

    const hasVoted = votedStatus[election.election_id];

    return (
      <div className="bg-neutral-800 rounded-xl border border-neutral-700 hover:border-neutral-600 transition-all duration-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">{election.title}</h3>
              <p className="text-neutral-400 text-sm mb-3 line-clamp-2">
                {election.description || 'No description available'}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${color === 'green' ? 'bg-green-800 text-green-300' :
                color === 'yellow' ? 'bg-yellow-800 text-yellow-300' :
                  'bg-gray-800 text-gray-300'
                }`}>
                {label}
              </span>
              {hasVoted && (
                <span className="px-3 py-1 bg-blue-800 text-blue-300 rounded-full text-xs font-medium flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Voted
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center text-neutral-400 text-sm space-x-4 mb-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>
                {new Date(election.start_time).toLocaleDateString()} - {new Date(election.end_time).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span>{election.total_candidates || 0} candidates</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-500">
              {status === 'active' && !hasVoted && (
                <span className="text-green-400 font-medium">Voting is open</span>
              )}
              {status === 'upcoming' && (
                <span className="text-yellow-400 font-medium">
                  Starts {new Date(election.start_time).toLocaleDateString()}
                </span>
              )}
              {status === 'ended' && (
                <span className="text-gray-400 font-medium">Voting has ended</span>
              )}
            </div>

            <div className="flex space-x-2">
              <Link
                to={`/voter/elections/${election.election_id}`}
                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                View Details
              </Link>

              {status === 'active' && !hasVoted && (
                <Link
                  to={`/voter/vote/${election.election_id}`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center"
                >
                  <Vote className="w-4 h-4 mr-1" />
                  Vote Now
                </Link>
              )}

              {status === 'result_declared' && (
                <Link
                  to={`/voter/results/${election.election_id}`}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  View Results
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen overflow-auto bg-neutral-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-700 rounded w-64 mb-8"></div>
            <div className="h-16 bg-neutral-700 rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-neutral-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-auto bg-neutral-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Elections</h1>
          <p className="text-neutral-400">
            Browse available elections and participate in the democratic process
          </p>
        </div>

        {/* Search and Filters */}
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
                className="pl-10 pr-8 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Elections</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="ended">Ended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Elections Grid */}
        {filteredElections.length > 0 ? (
          <div className="space-y-6">
            {filteredElections.map((election) => (
              <ElectionCard key={election.election_id} election={election} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Vote className="w-16 h-16 text-neutral-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-neutral-300 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No elections match your criteria' : 'No elections available'}
            </h3>
            <p className="text-neutral-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Check back later for new voting opportunities'
              }
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Statistics */}
        {elections.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 text-center">
              <div className="text-2xl font-bold text-white mb-2">{elections.length}</div>
              <div className="text-neutral-400 text-sm">Total Elections</div>
            </div>
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">
                {elections.filter(e => getElectionStatus(e).status === 'active').length}
              </div>
              <div className="text-neutral-400 text-sm">Active Elections</div>
            </div>
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-2">
                {Object.values(votedStatus).filter(Boolean).length}
              </div>
              <div className="text-neutral-400 text-sm">Your Votes Cast</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectionList;