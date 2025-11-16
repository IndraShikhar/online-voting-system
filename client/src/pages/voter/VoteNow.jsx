import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Vote, CheckCircle, ArrowLeft, User, AlertTriangle, Lock } from 'lucide-react';
import voterService from '../../services/voterService';

const VoteNow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadVotingData();
    }
  }, [id]);

  const loadVotingData = async () => {
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

      const status = electionData.status;
      if (status !== 'active') {
        setError('This election is not currently active for voting.');
      }

      if (votedStatus) {
        setError('You have already voted in this election.');
      }
    } catch (err) {
      console.error('Failed to load voting data:', err);
      setError('Failed to load election data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateSelect = (candidate) => {
    if (!hasVoted && !error) {
      setSelectedCandidate(candidate);
    }
  };

  const handleVoteSubmit = () => {
    if (selectedCandidate) {
      setShowConfirmation(true);
    }
  };

  const confirmVote = async () => {
    if (!selectedCandidate) return;

    setVoting(true);
    try {
      await voterService.castVote(election.election_id, selectedCandidate.candidate_id);

      // Show success and redirect after a delay
      setTimeout(() => {
        navigate(`/voter/elections/${election.election_id}`, {
          state: { voteSuccess: true }
        });
      }, 2000);

    } catch (err) {
      console.error('Failed to cast vote:', err);
      setError(err.response?.data?.message || 'Failed to cast vote. Please try again.');
      setShowConfirmation(false);
    } finally {
      setVoting(false);
    }
  };

  const CandidateCard = ({ candidate, isSelected, onSelect }) => {
    return (
      <div
        onClick={() => onSelect(candidate)}
        className={`p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${isSelected
          ? 'border-blue-500 bg-blue-900/20'
          : 'border-neutral-600 bg-neutral-700 hover:border-neutral-500 hover:bg-neutral-600'
          } ${(hasVoted || error) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center space-x-4">
          {/* Selection Indicator */}
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-neutral-400'
            }`}>
            {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
          </div>

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
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">{candidate.name}</h3>

            {candidate.party && (
              <div className="text-neutral-300 text-sm mb-2">
                Party: {candidate.party}
              </div>
            )}

            {candidate.biography && (
              <p className="text-neutral-400 text-sm line-clamp-2">
                {candidate.biography}
              </p>
            )}
          </div>

          {isSelected && (
            <div className="text-blue-500">
              <CheckCircle className="w-8 h-8" />
            </div>
          )}
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
            <div className="h-32 bg-neutral-700 rounded-xl mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-neutral-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (voting) {
    return (
      <div className="min-h-screen overflow-auto bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Vote className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Casting Your Vote...</h2>
          <p className="text-neutral-400">Please wait while we process your vote</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-auto bg-neutral-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/voter/elections/${id}`)}
          className="flex items-center text-neutral-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Election Details
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Cast Your Vote</h1>
          {election && (
            <p className="text-neutral-400">
              Election: <span className="text-white font-medium">{election.title}</span>
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="text-red-400 font-medium mb-1">Cannot Vote</h3>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Already Voted Message */}
        {hasVoted && (
          <div className="bg-green-900/20 border border-green-700 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div>
                <h3 className="text-green-400 font-medium mb-1">Vote Recorded</h3>
                <p className="text-green-300 text-sm">You have already cast your vote in this election.</p>
              </div>
            </div>
          </div>
        )}

        {/* Voting Instructions */}
        {!error && !hasVoted && (
          <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <Lock className="w-6 h-6 text-blue-400" />
              <div>
                <h3 className="text-blue-400 font-medium mb-1">Secure Voting</h3>
                <p className="text-blue-300 text-sm">
                  Select one candidate below and confirm your choice. Your vote is anonymous and secure.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Candidates */}
        {candidates.length > 0 ? (
          <div className="space-y-4 mb-8">
            {candidates.map((candidate) => (
              <CandidateCard
                key={candidate.candidate_id}
                candidate={candidate}
                isSelected={selectedCandidate?.candidate_id === candidate.candidate_id}
                onSelect={handleCandidateSelect}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-neutral-800 rounded-xl border border-neutral-700 mb-8">
            <User className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
            <p className="text-neutral-400">No candidates available for this election.</p>
          </div>
        )}

        {/* Vote Button */}
        {!error && !hasVoted && selectedCandidate && (
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium mb-1">
                  Selected: {selectedCandidate.name}
                </h3>
                <p className="text-neutral-400 text-sm">
                  Click "Submit Vote" to cast your ballot
                </p>
              </div>

              <button
                onClick={handleVoteSubmit}
                className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                <Vote className="w-5 h-5 mr-2" />
                Submit Vote
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-8 max-w-md mx-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Vote className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-xl font-bold text-white mb-2">Confirm Your Vote</h2>

                <p className="text-neutral-400 mb-6">
                  You are about to vote for:
                </p>

                <div className="bg-neutral-700 rounded-lg p-4 mb-6">
                  <div className="text-lg font-semibold text-white">
                    {selectedCandidate?.name}
                  </div>
                  {selectedCandidate?.party && (
                    <div className="text-neutral-300 text-sm">
                      {selectedCandidate.party}
                    </div>
                  )}
                </div>

                <p className="text-neutral-400 text-sm mb-6">
                  This action cannot be undone. Are you sure?
                </p>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 px-4 py-3 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                    disabled={voting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmVote}
                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    disabled={voting}
                  >
                    {voting ? 'Submitting...' : 'Confirm Vote'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoteNow;