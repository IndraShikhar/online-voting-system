import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Vote,
  BarChart3,
  Edit,
  Trash2,
  Play,
  Square,
  CheckCircle,
  AlertTriangle,
  Settings,
  Eye,
  UserPlus,
  FileText,
  Download,
  Share2,
  Copy,
  ExternalLink
} from 'lucide-react';
import adminService from '../services/adminService';

const ElectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      loadElectionData();
    }
  }, [id]);

  const loadElectionData = async () => {
    setLoading(true);
    try {
      const [electionData, candidatesData] = await Promise.all([
        adminService.getElectionDetails(id),
        adminService.getCandidatesByElection(id)
      ]);

      setElection(electionData?.data || electionData);
      setCandidates(candidatesData || []);

      // Load results if election is completed
      const status = getElectionStatus(electionData?.data || electionData);
      if (status === 'completed' || status === 'ended') {
        try {
          const resultsData = await adminService.getElectionResults(id);
          setResults(resultsData);
        } catch (error) {
          console.error('Failed to load results:', error);
        }
      }
    } catch (error) {
      console.error('Failed to load election data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getElectionStatus = (election) => {
    if (!election) return 'unknown';

    const now = new Date();
    const startTime = new Date(election.start_time);
    const endTime = new Date(election.end_time);

    if (election.results_declared) {
      return 'completed';
    } else if (now >= startTime && now <= endTime) {
      return 'active';
    } else if (now < startTime) {
      return 'upcoming';
    } else {
      return 'ended';
    }
  };

  const getStatusDisplay = (status) => {
    const statusConfig = {
      active: {
        label: 'Active',
        color: 'bg-green-600 text-white',
        icon: <Play className="w-4 h-4" />
      },
      upcoming: {
        label: 'Upcoming',
        color: 'bg-blue-600 text-white',
        icon: <Clock className="w-4 h-4" />
      },
      ended: {
        label: 'Ended',
        color: 'bg-yellow-600 text-white',
        icon: <Square className="w-4 h-4" />
      },
      completed: {
        label: 'Completed',
        color: 'bg-gray-600 text-white',
        icon: <CheckCircle className="w-4 h-4" />
      }
    };

    return statusConfig[status] || statusConfig.upcoming;
  };

  const handleStartElection = async () => {
    setActionLoading(true);
    try {
      await adminService.startElection(id);
      await loadElectionData();
    } catch (error) {
      console.error('Failed to start election:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEndElection = async () => {
    setActionLoading(true);
    try {
      await adminService.endElection(id);
      await loadElectionData();
    } catch (error) {
      console.error('Failed to end election:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeclareResults = async () => {
    setActionLoading(true);
    try {
      await adminService.declareResults(id);
      await loadElectionData();
    } catch (error) {
      console.error('Failed to declare results:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteElection = async () => {
    setActionLoading(true);
    try {
      await adminService.deleteElection(id);
      navigate('/admin/elections');
    } catch (error) {
      console.error('Failed to delete election:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyElectionLink = () => {
    const link = `${window.location.origin}/voter/elections/${id}`;
    navigator.clipboard.writeText(link);
    // Show success message
  };

  const TabButton = ({ tabId, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === tabId
        ? 'bg-blue-600 text-white'
        : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
        }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  const StatCard = ({ icon: Icon, label, value, color = 'bg-blue-600' }) => (
    <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
      <div className={`p-3 ${color} rounded-lg w-fit mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-neutral-400 text-sm">{label}</div>
    </div>
  );

  const CandidateCard = ({ candidate }) => (
    <div className="bg-neutral-700 rounded-lg border border-neutral-600 p-4 hover:border-neutral-500 transition-colors">
      <div className="flex items-center space-x-4">
        {candidate.avatar_url ? (
          <img
            src={candidate.avatar_url}
            alt={candidate.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-medium text-white">{candidate.name}</h4>
          <p className="text-neutral-400 text-sm">{candidate.party || 'Independent'}</p>
        </div>
        {results && (
          <div className="text-right">
            <div className="text-lg font-bold text-white">
              {results.find(r => r.candidate_id === candidate.candidate_id)?.votes || 0}
            </div>
            <div className="text-xs text-neutral-400">votes</div>
          </div>
        )}
      </div>
      {candidate.description && (
        <p className="text-neutral-300 text-sm mt-3 line-clamp-2">{candidate.description}</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-700 rounded w-64 mb-8"></div>
            <div className="h-32 bg-neutral-700 rounded-xl mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-neutral-700 rounded-xl"></div>
              ))}
            </div>
            <div className="h-64 bg-neutral-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-neutral-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Election Not Found</h2>
          <p className="text-neutral-400 mb-6">The election you're looking for doesn't exist.</p>
          <Link
            to="/admin/elections"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Elections
          </Link>
        </div>
      </div>
    );
  }

  const status = getElectionStatus(election);
  const statusDisplay = getStatusDisplay(status);

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/elections"
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">{election.title}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${statusDisplay.color}`}>
                  {statusDisplay.icon}
                  {statusDisplay.label}
                </span>
                <span className="text-neutral-400 text-sm">
                  Created {new Date(election.created_at || election.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={copyElectionLink}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy Link
            </button>

            <Link
              to={`/voter/elections/${id}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View as Voter
            </Link>

            <Link
              to={`/admin/elections/${id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 mb-8">
          <div className="flex flex-wrap gap-3">
            {status === 'upcoming' && (
              <button
                onClick={handleStartElection}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                Start Election
              </button>
            )}

            {status === 'active' && (
              <button
                onClick={handleEndElection}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Square className="w-4 h-4" />
                End Election
              </button>
            )}

            {status === 'ended' && !election.results_declared && (
              <button
                onClick={handleDeclareResults}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                Declare Results
              </button>
            )}

            <Link
              to={`/admin/candidates/add?election=${id}`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add Candidate
            </Link>

            {(status === 'completed' || status === 'ended') && (
              <Link
                to={`/admin/results/${id}`}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                View Results
              </Link>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            label="Total Candidates"
            value={candidates.length}
            color="bg-blue-600"
          />
          <StatCard
            icon={Vote}
            label="Votes Cast"
            value={election.vote_count || 0}
            color="bg-green-600"
          />
          <StatCard
            icon={Users}
            label="Eligible Voters"
            value={election.voter_count || 0}
            color="bg-purple-600"
          />
          <StatCard
            icon={BarChart3}
            label="Turnout Rate"
            value={election.voter_count ? `${Math.round((election.vote_count || 0) / election.voter_count * 100)}%` : '0%'}
            color="bg-orange-600"
          />
        </div>

        {/* Tabs */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
          <div className="border-b border-neutral-700 p-6">
            <div className="flex space-x-2">
              <TabButton tabId="overview" label="Overview" icon={FileText} />
              <TabButton tabId="candidates" label="Candidates" icon={Users} />
              {(status === 'completed' || status === 'ended') && (
                <TabButton tabId="results" label="Results" icon={BarChart3} />
              )}
              <TabButton tabId="timeline" label="Timeline" icon={Calendar} />
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                  <p className="text-neutral-300 leading-relaxed">
                    {election.description || 'No description provided for this election.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* <div>
                    <h4 className="font-medium text-white mb-3">Election Period</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-neutral-300">
                        <Calendar className="w-4 h-4 mr-3 text-neutral-400" />
                        <span className="text-neutral-400 w-16">Start:</span>
                        <span>{formatDateTime(election.start_time)}</span>
                      </div>
                      <div className="flex items-center text-neutral-300">
                        <Calendar className="w-4 h-4 mr-3 text-neutral-400" />
                        <span className="text-neutral-400 w-16">End:</span>
                        <span>{formatDateTime(election.end_time)}</span>
                      </div>
                    </div>
                  </div> */}

                  <div>
                    <h4 className="font-medium text-white mb-3">Settings</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Results Declared:</span>
                        <span className={election.results_declared ? 'text-green-400' : 'text-red-400'}>
                          {election.results_declared ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Election Type:</span>
                        <span className="text-neutral-300">{election.type || 'General'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Candidates Tab */}
            {activeTab === 'candidates' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">
                    Candidates ({candidates.length})
                  </h3>
                  <Link
                    to={`/admin/candidates/add?election=${id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add Candidate
                  </Link>
                </div>

                {candidates.length > 0 ? (
                  <div className="space-y-4">
                    {candidates.map((candidate) => (
                      <CandidateCard key={candidate.candidate_id} candidate={candidate} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-neutral-500 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-neutral-300 mb-2">No Candidates Yet</h4>
                    <p className="text-neutral-500 mb-4">Add candidates to get started with this election.</p>
                    <Link
                      to={`/admin/candidates/add?election=${id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      Add First Candidate
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Results Tab */}
            {activeTab === 'results' && (status === 'completed' || status === 'ended') && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-6">Election Results</h3>
                {results ? (
                  <div className="space-y-4">
                    {results.map((result, index) => {
                      const candidate = candidates.find(c => c.candidate_id === result.candidate_id);
                      const percentage = election.vote_count > 0
                        ? (result.vote_count / election.vote_count * 100).toFixed(1)
                        : 0;

                      return (
                        <div key={result.candidate_id} className="bg-neutral-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-neutral-600'
                                }`}>
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-medium text-white">{candidate?.name || 'Unknown'}</div>
                                <div className="text-sm text-neutral-400">{candidate?.party || 'Independent'}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-white">{result.vote_count} votes</div>
                              <div className="text-sm text-neutral-400">{percentage}%</div>
                            </div>
                          </div>
                          <div className="w-full bg-neutral-600 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${index === 0 ? 'bg-yellow-500' : 'bg-blue-500'
                                }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-neutral-500 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-neutral-300 mb-2">No Results Available</h4>
                    <p className="text-neutral-500">Results will be available once the election ends and results are declared.</p>
                  </div>
                )}
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-6">Election Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-600 rounded-full">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Election Created</div>
                      <div className="text-sm text-neutral-400">
                        {formatDateTime(election.created_at || election.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${new Date() >= new Date(election.start_time) ? 'bg-green-600' : 'bg-neutral-600'
                      }`}>
                      <Play className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Voting Starts</div>
                      <div className="text-sm text-neutral-400">
                        {formatDateTime(election.start_time)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${new Date() >= new Date(election.end_time) ? 'bg-yellow-600' : 'bg-neutral-600'
                      }`}>
                      <Square className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Voting Ends</div>
                      <div className="text-sm text-neutral-400">
                        {formatDateTime(election.end_time)}
                      </div>
                    </div>
                  </div>

                  {election.results_declared && (
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-purple-600 rounded-full">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">Results Declared</div>
                        <div className="text-sm text-neutral-400">
                          {election.results_declared_at ?
                            formatDateTime(election.results_declared_at) :
                            'Recently'
                          }
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {
        showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 max-w-md w-full">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-red-600 rounded-lg mr-4">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Delete Election</h3>
                  <p className="text-neutral-400 text-sm">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-neutral-300 mb-6">
                Are you sure you want to delete "<strong>{election.title}</strong>"?
                This will permanently remove the election and all associated data including votes and results.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
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
        )
      }
    </div >
  );
};

export default ElectionDetail;