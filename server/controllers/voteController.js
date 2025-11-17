import catchAsync from '../utils/catchAsync.js';
import db from '../utils/db.js';

const voteController = {
  castVote: catchAsync(async function (req, res) {
    // Cast a vote for a candidate (voter only)
    const { election_id, candidate_id } = req.body;
    const username = req.user.username; // Assuming user is authenticated

    // Check if user has already voted in this election
    const [votes] = await db.query(
      'SELECT * FROM votes WHERE election_id = ? AND username = ?',
      [election_id, username]
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
      'INSERT INTO votes (election_id, candidate_id, username) VALUES (?, ?, ?)',
      [election_id, candidate_id, username]
    );
    // Update vote count for the candidate
    await db.query(
      'UPDATE candidates SET votes = votes + 1 WHERE candidate_id = ?',
      [candidate_id]
    );
    res.status(200).json({
      status: 'success',
      message: 'Vote cast successfully',
    });
  }),

  hasUserVoted: catchAsync(async function (req, res) {
    // Check if user has voted in this election
    const election_id = req.params.electionId;
    const username = req.user.username;

    const [votes] = await db.query(
      'SELECT * FROM votes WHERE election_id = ? AND username = ?',
      [election_id, username]
    );
    res.status(200).json({
      status: 'success',
      data: {
        hasVoted: votes.length > 0,
      },
    });
  }),

  getVotesForElection: catchAsync(async function (req, res) {
    const election_id = req.params.electionId;
    const [votes] = await db.query(
      'SELECT COUNT(*) AS votes FROM votes WHERE election_id = ?',
      [election_id]
    );
    res.status(200).json({
      status: 'success',
      data: {
        votes: votes[0].votes,
      },
    });
  }),

  getCurrentResult: catchAsync(async function (req, res) {
    // Get current or final results (depending on status)
    const election_id = req.params.electionId;
    const [results] = await db.query(
      `SELECT c.candidate_id, c.username, u.name, c.party, c.votes
       FROM candidates c
       JOIN users u ON c.username = u.username
       WHERE c.election_id = ?
       ORDER BY c.votes DESC`,
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
      `SELECT c.candidate_id, c.username, u.name, COUNT(v.vote_id) AS total_votes
       FROM candidates c
       LEFT JOIN votes v ON c.candidate_id = v.candidate_id
       JOIN users u ON c.username = u.username
       WHERE c.election_id = ?
       GROUP BY c.candidate_id, c.username, u.name`,
      [election_id]
    );

    res.status(200).json({
      status: 'success',
      data: results,
    });
  }),

  getUserVotingStats: catchAsync(async function (req, res) {
    // Get voting statistics for the authenticated user

    // totalElections
    //     votedElections
    //     upcomingElections
    //     completedElections

    const username = req.user.username;
    const [totalElectionsResult] = await db.query(
      'SELECT COUNT(*) AS totalElections FROM elections'
    );
    const [votedElectionsResult] = await db.query(
      'SELECT COUNT(*) AS votedElections FROM votes WHERE username = ?',
      [username]
    );
    const [upcomingElectionsResult] = await db.query(
      'SELECT COUNT(*) AS upcomingElections FROM elections WHERE status = "upcoming" OR status = "in_progress"'
    );
    const [completedElectionsResult] = await db.query(
      'SELECT COUNT(*) AS completedElections FROM elections WHERE status = "result_declared"'
    );
    res.status(200).json({
      status: 'success',
      data: {
        totalElections: totalElectionsResult[0].totalElections,
        votedElections: votedElectionsResult[0].votedElections,
        upcomingElections: upcomingElectionsResult[0].upcomingElections,
        completedElections: completedElectionsResult[0].completedElections,
      },
    });
  }),

  getVoterTurnout: catchAsync(async function (req, res) {
    // Calculate total votes across all elections
    const [totalVotesResult] = await db.query(
      'SELECT COUNT(*) AS totalVotes FROM votes'
    );
    const totalVoterTurnout = totalVotesResult[0].totalVotes; // / totalVotersResult[0].totalVoters) * 100;
    res.status(200).json({
      status: 'success',
      data: {
        totalVoterTurnout,
      },
    });
  }),
};

export default voteController;
