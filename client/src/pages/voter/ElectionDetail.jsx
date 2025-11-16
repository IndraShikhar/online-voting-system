import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, Vote, CheckCircle, Clock, ArrowLeft, User, Award } from 'lucide-react';
import voterService from '../../services/voterService';

const ElectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadElectionData();
    }
  }, [id]);

  const loadElectionData = async () => {
    setLoading(true);
    setError('');

    try {
      const [electionData, candidatesData, votedStatus] = await Promise.all([
        voterService.getElectionDetails(id),
        voterService.getElectionCandidates(id),
        voterService.hasVoted(id)
      ]);

      setElection(electionData);
      setCandidates(candidatesData);
      setHasVoted(votedStatus);
    } catch (err) {
      console.error('Failed to load election data:', err);
      setError('Failed to load election details. Please try again.');
    } finally {
      setLoading(false);
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

  const CandidateCard = ({ candidate }) => {
    return (
      <div className="bg-neutral-700 rounded-lg p-6 border border-neutral-600 hover:border-neutral-500 transition-all duration-200">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          {candidate.avatar_url ?
            (<div>
              <img src={candidate.avatar_url} alt={candidate.name} className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shrink-0" />
            </div>)
            :
            (<div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shrink-0">
              <User className="w-8 h-8 text-white" />
            </div>)
          }

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white mb-2">{candidate.name}</h3>

            {candidate.party && (
              <div className="flex items-center mb-2">
                <Award className="w-4 h-4 text-neutral-400 mr-2" />
                <span className="text-neutral-300 text-sm">{candidate.party}</span>
              </div>
            )}

            {candidate.biography && (
              <p className="text-neutral-400 text-sm line-clamp-3 mb-3">
                {candidate.biography}
              </p>
            )}

            {/* Candidate Stats */}
            <div className="flex items-center text-xs text-neutral-500">
              <span>Candidate ID: {candidate.candidate_id}</span>
            </div>
          </div>
        </div>
      </div >
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen overflow-auto bg-neutral-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-700 rounded w-64 mb-8"></div>
            <div className="h-64 bg-neutral-700 rounded-xl mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-neutral-700 rounded-lg"></div>
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

  const { status } = election;
  console.log(status);
  let label, color;
  if (status === 'upcoming') {
    label = 'Upcoming';
    color = 'yellow';
  }
  else if (status === 'active') {
    label = 'Active';
    color = 'green';
  }
  else if (status === 'ended') {
    label = 'Ended';
    color = 'gray';
  }
  else if (status === 'result_declared') {
    label = 'Result Declared';
    color = 'blue';
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

        {/* Election Header */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-4">{election.title}</h1>

              {election.description && (
                <p className="text-neutral-300 text-lg mb-6 leading-relaxed">
                  {election.description}
                </p>
              )}
            </div>

            <div className="flex flex-col items-end space-y-3">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${color === 'green' ? 'bg-green-800 text-green-300' :
                color === 'yellow' ? 'bg-yellow-800 text-yellow-300' :
                  'bg-gray-800 text-gray-300'
                }`}>
                {label}
              </span>

              {hasVoted && (
                <span className="px-4 py-2 bg-blue-800 text-blue-300 rounded-full text-sm font-medium flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  You have voted
                </span>
              )}
            </div>
          </div>

          {/* Election Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-neutral-700 rounded-lg">
                <Calendar className="w-5 h-5 text-neutral-300" />
              </div>
              <div>
                <div className="text-neutral-400 text-sm">Start Date</div>
                <div className="text-white font-medium">{formatDateTime(election.start_time)}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-neutral-700 rounded-lg">
                <Clock className="w-5 h-5 text-neutral-300" />
              </div>
              <div>
                <div className="text-neutral-400 text-sm">End Date</div>
                <div className="text-white font-medium">{formatDateTime(election.end_time)}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-neutral-700 rounded-lg">
                <Users className="w-5 h-5 text-neutral-300" />
              </div>
              <div>
                <div className="text-neutral-400 text-sm">Candidates</div>
                <div className="text-white font-medium">{candidates.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Voting Actions */}
        {status === 'active' && (
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Ready to Vote?</h2>
                <p className="text-neutral-400">
                  {hasVoted
                    ? 'You have already cast your vote in this election.'
                    : 'Review the candidates below and cast your vote.'
                  }
                </p>
              </div>

              {!hasVoted && (
                <Link
                  to={`/voter/vote/${election.election_id}`}
                  className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Vote className="w-5 h-5 mr-2" />
                  Cast Your Vote
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Candidates Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Candidates</h2>

          {candidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {candidates.map((candidate) => (
                <CandidateCard key={candidate.candidate_id} candidate={candidate} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-neutral-800 rounded-xl border border-neutral-700">
              <Users className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
              <p className="text-neutral-400">No candidates registered for this election yet.</p>
            </div>
          )}
        </div>

        {/* Additional Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          {status === 'ended' && (
            <Link
              to={`/voter/results/${election.election_id}`}
              className="flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              <Award className="w-5 h-5 mr-2" />
              View Results
            </Link>
          )}

          <Link
            to="/voter/elections"
            className="flex items-center justify-center px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white font-medium rounded-lg transition-colors"
          >
            Back to All Elections
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ElectionDetail;