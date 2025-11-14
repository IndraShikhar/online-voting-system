import catchAsync from '../utils/catchAsync.js';
import db from '../utils/db.js';

const voteController = {
  castVote: catchAsync(async function (req, res) {
    // Cast a vote for a candidate (voter only)
    const { election_id, candidate_id } = req.body;

    const user_id = req.user.user_id; // Assuming user is authenticated
    // Check if user has already voted in this election
    const [votes] = await db.query(
      'SELECT * FROM votes WHERE election_id = ? AND user_id = ?',
      [election_id, user_id]
    );
    if (votes.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already voted in this election',
      });
    }

    // Check if candidate exists
    const [candidates] = await db.query(
      'SELECT * FROM candidates WHERE candidate_id = ? AND election_id = ?',
      [candidate_id, election_id]
    );
    if (candidates.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Candidate not found',
      });
    }

    // Insert vote into votes table
    await db.query(
      'INSERT INTO votes (election_id, candidate_id, user_id) VALUES (?, ?, ?)',
      [election_id, candidate_id, user_id]
    );

    // Update vote count for the candidate

    res.status(200).json({
      status: 'success',
      data: {
        message: `Vote casted for candidate ${candidate_id} in election ${election_id}`,
      },
    });
  }),

  hasUserVoted: catchAsync(async function (req, res) {
    // Check if user has voted in this election
    const election_id = req.params.electionId;
    const user_id = req.user.user_id;

    const [votes] = await db.query(
      'SELECT * FROM votes WHERE election_id = ? AND user_id = ?',
      [election_id, user_id]
    );

    res.status(200).json({
      status: 'success',
      data: {
        hasVoted: votes.length > 0,
      },
    });
  }),

  getCurrentResult: catchAsync(async function (req, res) {
    // Get current or final results (depending on status)
    const election_id = req.params.electionId;
    const [results] = await db.query(
      `SELECT c.candidate_id, c.name, c.party, COUNT(v.vote_id) AS votes
       FROM candidates c
       LEFT JOIN votes v ON c.candidate_id = v.candidate_id
       WHERE c.election_id = ?
       GROUP BY c.candidate_id, c.name, c.party`,
      [election_id]
    );

    res.status(200).json({
      status: 'success',
      data: results,
    });
  }),

  totalVotesForAllCandidates: catchAsync(async function (req, res) {
    // Get total votes for each candidate (admin only)

    const election_id = req.params.electionId;
    const [results] = await db.query(
      `SELECT c.candidate_id, c.name, COUNT(v.vote_id) AS total_votes
       FROM candidates c
       LEFT JOIN votes v ON c.candidate_id = v.candidate_id
       WHERE c.election_id = ?
       GROUP BY c.candidate_id, c.name`,
      [election_id]
    );
    res.status(200).json({
      status: 'success',
      data: results,
    });
  }),
};

export default voteController;
