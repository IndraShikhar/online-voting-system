import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart, ArrowLeft, Users, Vote, Crown, TrendingUp, Calendar } from 'lucide-react';
import voterService from '../../services/voterService';

const ResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalVotes, setTotalVotes] = useState(0);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (id) {
      loadResults();
    }
  }, [id]);

  const loadResults = async () => {
    setLoading(true);
    setError('');

    try {
      const [electionData, resultsData] = await Promise.all([
        voterService.getElectionDetails(id),
        voterService.getElectionResults(id)
      ]);

      setElection(electionData);

      // Process results data
      const candidates = resultsData.candidates || resultsData || [];
      const total = candidates.reduce((sum, candidate) => sum + (candidate.votes || 0), 0);

      // Sort candidates by vote count
      const sortedCandidates = candidates.sort((a, b) => (b.votes || 0) - (a.votes || 0));

      setResults(sortedCandidates);
      setTotalVotes(total);
      setWinner(sortedCandidates[0] || null);

    } catch (err) {
      console.error('Failed to load results:', err);
      setError('Failed to load election results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getVotePercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
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

  const ResultBar = ({ candidate, position }) => {
    const percentage = getVotePercentage(candidate.votes || 0);
    const isWinner = position === 1;

    return (
      <div className={`bg-neutral-800 rounded-xl border p-6 ${isWinner ? 'border-yellow-500 bg-yellow-900/10' : 'border-neutral-700'
        }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Position */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isWinner ? 'bg-yellow-500 text-black' :
              position === 2 ? 'bg-gray-400 text-black' :
                position === 3 ? 'bg-orange-500 text-white' :
                  'bg-neutral-600 text-white'
              }`}>
              {isWinner && <Crown className="w-4 h-4" />}
              {!isWinner && position}
            </div>

            {/* Candidate Info */}
            <div>
              <h3 className={`text-lg font-semibold ${isWinner ? 'text-yellow-400' : 'text-white'
                }`}>
                {candidate.name}
                {isWinner && <span className="ml-2 text-sm text-yellow-300">(Winner)</span>}
              </h3>
              {candidate.party && (
                <p className="text-neutral-400 text-sm">{candidate.party}</p>
              )}
            </div>
          </div>

          {/* Vote Count */}
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {candidate.votes || 0}
            </div>
            <div className="text-neutral-400 text-sm">
              {percentage}% of votes
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-1000 ease-out ${isWinner ? 'bg-yellow-500' :
              position === 2 ? 'bg-gray-400' :
                position === 3 ? 'bg-orange-500' :
                  'bg-blue-500'
              }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen overflow-auto bg-neutral-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-700 rounded w-48 mb-8"></div>
            <div className="h-64 bg-neutral-700 rounded-xl mb-8"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-neutral-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen overflow-auto bg-neutral-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <button
            onClick={() => navigate('/voter/elections')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Elections
          </button>
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen overflow-auto bg-neutral-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-neutral-400 text-xl mb-4">Election not found</div>
          <button
            onClick={() => navigate('/voter/elections')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Elections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-auto bg-neutral-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/voter/elections')}
          className="flex items-center text-neutral-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Elections
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Election Results</h1>
          </div>
          <h2 className="text-xl text-neutral-300 mb-2">{election.title}</h2>
          {election.description && (
            <p className="text-neutral-400">{election.description}</p>
          )}
        </div>

        {/* Election Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 text-center">
            <div className="p-3 bg-blue-600 rounded-lg w-fit mx-auto mb-3">
              <Vote className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{totalVotes}</div>
            <div className="text-neutral-400 text-sm">Total Votes</div>
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 text-center">
            <div className="p-3 bg-purple-600 rounded-lg w-fit mx-auto mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{results.length}</div>
            <div className="text-neutral-400 text-sm">Candidates</div>
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 text-center">
            <div className="p-3 bg-green-600 rounded-lg w-fit mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {totalVotes > 0 ? `${getVotePercentage(winner?.votes || 0)}%` : '0%'}
            </div>
            <div className="text-neutral-400 text-sm">Winning Margin</div>
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 text-center">
            <div className="p-3 bg-yellow-600 rounded-lg w-fit mx-auto mb-3">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm font-medium text-white mb-1">Ended</div>
            <div className="text-neutral-400 text-xs">
              {formatDateTime(election.end_time)}
            </div>
          </div>
        </div>

        {/* Winner Announcement */}
        {winner && totalVotes > 0 && (
          <div className="bg-linear-to-r from-yellow-600 to-yellow-700 rounded-xl p-8 mb-8 text-center">
            <Crown className="w-12 h-12 text-yellow-200 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">🎉 Election Winner 🎉</h2>
            <div className="text-3xl font-bold text-yellow-200 mb-2">{winner.name}</div>
            {winner.party && (
              <div className="text-yellow-300 mb-4">{winner.party}</div>
            )}
            <div className="text-yellow-200">
              Won with <span className="font-bold">{winner.votes || 0} votes</span>
              {' '}({getVotePercentage(winner.votes || 0)}% of total votes)
            </div>
          </div>
        )}

        {/* Results */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-6">Detailed Results</h3>

          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((candidate, index) => (
                <ResultBar
                  key={candidate.candidate_id || index}
                  candidate={candidate}
                  position={index + 1}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-neutral-800 rounded-xl border border-neutral-700">
              <BarChart className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
              <p className="text-neutral-400">No results available for this election.</p>
            </div>
          )}
        </div>

        {/* Statistics Summary */}
        {results.length > 0 && totalVotes > 0 && (
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Voting Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-neutral-300 font-medium mb-3">Top 3 Candidates</h5>
                <div className="space-y-2">
                  {results.slice(0, 3).map((candidate, index) => (
                    <div key={candidate.candidate_id || index} className="flex justify-between items-center text-sm">
                      <span className="text-neutral-400">
                        {index + 1}. {candidate.name}
                      </span>
                      <span className="text-white font-medium">
                        {candidate.votes || 0} ({getVotePercentage(candidate.votes || 0)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-neutral-300 font-medium mb-3">Election Period</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Started:</span>
                    <span className="text-white">{new Date(election.start_time).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Ended:</span>
                    <span className="text-white">{new Date(election.end_time).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Duration:</span>
                    <span className="text-white">
                      {Math.ceil((new Date(election.end_time) - new Date(election.start_time)) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPage;