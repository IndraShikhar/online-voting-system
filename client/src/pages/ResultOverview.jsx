import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BarChart3,
  PieChart,
  Trophy,
  Users,
  Vote,
  Download,
  Share2,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Filter,
  Search,
  Eye,
  FileText,
  TrendingUp,
  Award,
  Target,
  Percent,
  Hash,
  Crown,
  Medal,
  Star
} from 'lucide-react';
import adminService from '../services/adminService';

const ResultsManagement = () => {
  const { electionId } = useParams();
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [results, setResults] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadElections();
    if (electionId) {
      loadElectionResults(electionId);
    }
  }, [electionId]);

  const loadElections = async () => {
    try {
      const response = await adminService.getAllElections();
      const electionsData = response?.data || response || [];

      // Filter elections that have ended or completed
      const completedElections = electionsData.filter(election => {
        const now = new Date();
        const endTime = new Date(election.end_time);
        return now >= endTime || election.results_declared;
      });

      setElections(completedElections);

      if (!electionId && completedElections.length > 0) {
        loadElectionResults(completedElections[0].election_id);
      }
    } catch (error) {
      console.error('Failed to load elections:', error);
    }
  };

  const loadElectionResults = async (id) => {
    setLoading(true);
    try {
      const [electionResponse, resultsResponse, candidatesResponse] = await Promise.all([
        adminService.getElectionDetails(id),
        adminService.getElectionResults(id),
        adminService.getCandidatesByElection(id)
      ]);

      setSelectedElection(electionResponse?.data || electionResponse);
      setResults(resultsResponse?.data || resultsResponse || []);
      setCandidates(candidatesResponse?.data || candidatesResponse?.data || []);
    } catch (error) {
      console.error('Failed to load election results:', error);
      setResults([]);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleElectionChange = (electionId) => {
    loadElectionResults(electionId);
  };

  const calculateStats = () => {
    if (!selectedElection || !results.length) {
      return { totalVotes: 0, turnout: 0, winner: null, margin: 0 };
    }

    const totalVotes = results.reduce((sum, result) => sum + (result.vote_count || 0), 0);
    const turnout = selectedElection.voter_count ?
      ((totalVotes / selectedElection.voter_count) * 100).toFixed(1) : 0;

    const sortedResults = [...results].sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
    const winner = sortedResults[0];
    const runnerUp = sortedResults[1];
    const margin = winner && runnerUp ?
      ((winner.vote_count - runnerUp.vote_count) / totalVotes * 100).toFixed(1) : 0;

    return { totalVotes, turnout, winner, margin };
  };

  const getWinnerCandidate = (winnerId) => {
    return candidates.find(c => c.candidate_id === winnerId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatCard = ({ icon: Icon, label, value, subtitle, color = 'bg-blue-600' }) => (
    <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
      <div className={`p-3 ${color} rounded-lg w-fit mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-neutral-400 text-sm">{label}</div>
      {subtitle && (
        <div className="text-neutral-500 text-xs mt-1">{subtitle}</div>
      )}
    </div>
  );

  const ResultCard = ({ result, candidate, position, totalVotes }) => {
    const percentage = totalVotes > 0 ? ((result.vote_count || 0) / totalVotes * 100).toFixed(1) : 0;

    const getPositionStyle = (pos) => {
      if (pos === 1) return 'from-yellow-500 to-orange-600';
      if (pos === 2) return 'from-gray-400 to-gray-600';
      if (pos === 3) return 'from-orange-600 to-red-600';
      return 'from-neutral-600 to-neutral-700';
    };

    const getPositionIcon = (pos) => {
      if (pos === 1) return <Crown className="w-5 h-5" />;
      if (pos === 2) return <Medal className="w-5 h-5" />;
      if (pos === 3) return <Star className="w-5 h-5" />;
      return <Hash className="w-5 h-5" />;
    };

    return (
      <div className={`bg-neutral-700 rounded-xl border p-6 ${position === 1 ? 'border-yellow-500 bg-yellow-900/20' : 'border-neutral-600'
        }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-linear-to-br ${getPositionStyle(position)} rounded-full flex items-center justify-center text-white font-bold`}>
              {getPositionIcon(position)}
            </div>
            <div>
              <h3 className="font-semibold text-white">{candidate?.name || 'Unknown'}</h3>
              <p className="text-neutral-400 text-sm">{candidate?.party || 'Independent'}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{result.vote_count || 0}</div>
            <div className="text-sm text-neutral-400">votes</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Vote Share</span>
            <span className="text-white font-medium">{percentage}%</span>
          </div>
          <div className="w-full bg-neutral-600 rounded-full h-2">
            <div
              className={`h-2 rounded-full bg-linear-to-r ${getPositionStyle(position)}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {position === 1 && (
          <div className="mt-3 px-3 py-1 bg-yellow-600/20 border border-yellow-600 rounded-lg text-center">
            <span className="text-yellow-400 text-sm font-medium flex items-center justify-center gap-1">
              <Trophy className="w-4 h-4" />
              Winner
            </span>
          </div>
        )}
      </div>
    );
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

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-700 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-neutral-700 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-neutral-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const stats = calculateStats();
  const sortedResults = [...results].sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/dashboard"
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Election Results</h1>
              <p className="text-neutral-400 mt-1">
                View and analyze election results and statistics
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export Results
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {/* Election Selector */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Select Election</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={selectedElection?.election_id || ''}
              onChange={(e) => handleElectionChange(e.target.value)}
              className="px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose an election...</option>
              {elections.map((election) => (
                <option key={election.election_id} value={election.election_id}>
                  {election.title} - {formatDate(election.end_time)}
                </option>
              ))}
            </select>

            {selectedElection && (
              <div className="flex items-center justify-between p-3 bg-neutral-700 rounded-lg">
                <div>
                  <div className="font-medium text-white">{selectedElection.title}</div>
                  <div className="text-sm text-neutral-400">
                    Ended: {formatDate(selectedElection.end_time)}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${selectedElection.results_declared
                    ? 'bg-green-900/50 text-green-300'
                    : 'bg-yellow-900/50 text-yellow-300'
                  }`}>
                  {selectedElection.results_declared ? 'Results Declared' : 'Results Pending'}
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedElection ? (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={Vote}
                label="Total Votes"
                value={stats.totalVotes.toLocaleString()}
                subtitle={`${results.length} candidates`}
                color="bg-blue-600"
              />
              <StatCard
                icon={Users}
                label="Voter Turnout"
                value={`${stats.turnout}%`}
                subtitle={`${selectedElection.voter_count || 0} eligible voters`}
                color="bg-green-600"
              />
              <StatCard
                icon={Trophy}
                label="Victory Margin"
                value={`${stats.margin}%`}
                subtitle="Lead percentage"
                color="bg-yellow-600"
              />
              <StatCard
                icon={Target}
                label="Participation"
                value={`${((stats.totalVotes / (selectedElection.voter_count || 1)) * 100).toFixed(0)}%`}
                subtitle="Of eligible voters"
                color="bg-purple-600"
              />
            </div>

            {/* Winner Highlight */}
            {stats.winner && (
              <div className="bg-linear-to-r from-yellow-900/50 to-orange-900/50 border border-yellow-700 rounded-xl p-6 mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-linear-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">Election Winner</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      {getWinnerCandidate(stats.winner.candidate_id)?.name || 'Unknown'}
                    </h2>
                    <p className="text-neutral-300">
                      {getWinnerCandidate(stats.winner.candidate_id)?.party || 'Independent'} •
                      {stats.winner.vote_count?.toLocaleString()} votes ({((stats.winner.vote_count / stats.totalVotes) * 100).toFixed(1)}%)
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">{stats.winner.vote_count?.toLocaleString()}</div>
                    <div className="text-neutral-400">votes</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden mb-8">
              <div className="border-b border-neutral-700 p-6">
                <div className="flex space-x-2">
                  <TabButton tabId="overview" label="Overview" icon={BarChart3} />
                  <TabButton tabId="detailed" label="Detailed Results" icon={FileText} />
                  <TabButton tabId="analytics" label="Analytics" icon={TrendingUp} />
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedResults.map((result, index) => {
                      const candidate = candidates.find(c => c.candidate_id === result.candidate_id);
                      return (
                        <ResultCard
                          key={result.candidate_id}
                          result={result}
                          candidate={candidate}
                          position={index + 1}
                          totalVotes={stats.totalVotes}
                        />
                      );
                    })}
                  </div>
                )}

                {activeTab === 'detailed' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-neutral-700 border-b border-neutral-600">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-medium text-neutral-300">Rank</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-neutral-300">Candidate</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-neutral-300">Party</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-neutral-300">Votes</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-neutral-300">Percentage</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-neutral-300">Margin</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedResults.map((result, index) => {
                          const candidate = candidates.find(c => c.candidate_id === result.candidate_id);
                          const percentage = stats.totalVotes > 0 ? ((result.vote_count || 0) / stats.totalVotes * 100).toFixed(2) : 0;
                          const margin = index === 0 ? '-' :
                            ((sortedResults[0].vote_count - result.vote_count) / stats.totalVotes * 100).toFixed(2) + '%';

                          return (
                            <tr key={result.candidate_id} className="border-b border-neutral-700 hover:bg-neutral-700/50">
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-yellow-600' :
                                      index === 1 ? 'bg-gray-600' :
                                        index === 2 ? 'bg-orange-600' : 'bg-neutral-600'
                                    }`}>
                                    {index + 1}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-medium text-white">{candidate?.name || 'Unknown'}</div>
                              </td>
                              <td className="px-6 py-4 text-neutral-300">{candidate?.party || 'Independent'}</td>
                              <td className="px-6 py-4">
                                <span className="font-semibold text-white">{result.vote_count?.toLocaleString() || 0}</span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="font-medium text-white">{percentage}%</span>
                              </td>
                              <td className="px-6 py-4 text-neutral-300">{margin}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Vote Distribution */}
                      <div className="bg-neutral-700 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Vote Distribution</h3>
                        <div className="space-y-3">
                          {sortedResults.slice(0, 5).map((result, index) => {
                            const candidate = candidates.find(c => c.candidate_id === result.candidate_id);
                            const percentage = stats.totalVotes > 0 ? ((result.vote_count || 0) / stats.totalVotes * 100) : 0;
                            return (
                              <div key={result.candidate_id} className="flex items-center justify-between">
                                <span className="text-white">{candidate?.name || 'Unknown'}</span>
                                <div className="flex items-center space-x-2">
                                  <div className="w-24 h-2 bg-neutral-600 rounded-full">
                                    <div
                                      className="h-2 bg-blue-500 rounded-full"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                  <span className="text-neutral-300 text-sm w-12">{percentage.toFixed(1)}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Key Metrics */}
                      <div className="bg-neutral-700 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Key Metrics</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Total Candidates</span>
                            <span className="text-white font-semibold">{candidates.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Valid Votes</span>
                            <span className="text-white font-semibold">{stats.totalVotes.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Voter Turnout</span>
                            <span className="text-white font-semibold">{stats.turnout}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Victory Margin</span>
                            <span className="text-white font-semibold">{stats.margin}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Election Status</span>
                            <span className={selectedElection.results_declared ? 'text-green-400' : 'text-yellow-400'}>
                              {selectedElection.results_declared ? 'Declared' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-12 text-center">
            <BarChart3 className="w-16 h-16 text-neutral-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Election Selected</h2>
            <p className="text-neutral-400 mb-6">
              Select an election from the dropdown above to view its results and analytics.
            </p>
            {elections.length === 0 && (
              <p className="text-neutral-500 text-sm">
                No completed elections found. Elections will appear here once they have ended.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsManagement;