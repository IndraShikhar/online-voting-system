import catchAsync from '../utils/catchAsync.js';
import db from '../utils/db.js';
import { toMySQLDate } from '../utils/utils.js';

const electionController = {
  createNewElection: catchAsync(async (req, res) => {
    // Create a new election (admin only)
    const { title, description} = req.body;
    const start_time = req.body.start_time || null;
    const end_time = req.body.end_time || null;
    const status = 'upcoming';
    const created_by = req.user.user_id;

    await db.query('INSERT INTO elections SET ?', {
      title,
      description,
      start_time: toMySQLDate(new Date(start_time)),
      end_time: toMySQLDate(new Date(end_time)),
      status: 'upcoming',
      created_by,
    });

    res.status(201).json({
      status: 'success',
      data: {
        message: 'Election created successfully',
        election: { title, description, start_time, end_time, status },
      },
    });
  }),

  getAllElections: catchAsync(async (req, res) => {
    const [elections] = await db.query('SELECT * FROM elections');

    res.status(200).json({
      status: 'success',
      data: {
        results: elections.length,
        elections,
      },
    });
  }),

  getDetailOfElection: catchAsync(async function (req, res) {
    const electionId = req.params.id;

    const [election] = await db
      .query('SELECT * FROM elections WHERE election_id = ?', [electionId])
      .then((results) => results[0]);

    res.status(200).json({
      status: 'success',
      data: {
        election: election,
      },
    });
  }),

  startElection: catchAsync(async function (req, res) {
    // Start an election (admin only)
    const electionId = req.params.id;
    await db.query('UPDATE elections SET status = ? WHERE election_id = ?', [
      'active',
      electionId,
    ]);

    const [election] = await db
      .query('SELECT * FROM elections WHERE election_id = ?', [electionId])
      .then((results) => results[0]);

    res.status(200).json({
      status: 'success',
      data: {
        election,
      },
    });
  }),

  endElection: catchAsync(async function (req, res) {
    // End an election (admin only)
    const electionId = req.params.id;
    await db.query('UPDATE elections SET status = ? WHERE election_id = ?', [
      'ended',
      electionId,
    ]);

    const [election] = await db
      .query('SELECT * FROM elections WHERE election_id = ?', [electionId])
      .then((results) => results[0]);

    res.status(200).json({
      status: 'success',
      data: {
        election,
      },
    });
  }),

    declareResults: catchAsync(async function (req, res) {
      const electionId = req.params.id;
  
      // mark election as results declared
      await db.query('UPDATE elections SET status = ? WHERE election_id = ?', [
        'result_declared',
        electionId,
      ]);
  
      // aggregate votes per candidate, include candidates with zero votes, and pull candidate user name
      const [candidates] = await db.query(
        `SELECT c.candidate_id, c.username, c.party, IFNULL(v.votes, 0) AS votes, u.name
         FROM candidates c
         LEFT JOIN (
           SELECT candidate_id, COUNT(*) AS votes
           FROM votes
           WHERE election_id = ?
           GROUP BY candidate_id
         ) v ON c.candidate_id = v.candidate_id
         LEFT JOIN users u ON c.username = u.username
         WHERE c.election_id = ?
         ORDER BY votes DESC, c.candidate_id ASC`,
        [electionId, electionId]
      );
  
      // total votes in this election
      const totalVotes = candidates.reduce((sum, c) => sum + Number(c.votes || 0), 0);
  
      // update candidates.votes and candidates.vote_share according to aggregated counts
      for (const c of candidates) {
        const votes = Number(c.votes || 0);
        const voteShare = totalVotes > 0 ? Number(((votes / totalVotes) * 100).toFixed(2)) : 0;
        await db.query(
          'UPDATE candidates SET votes = ?, vote_share = ? WHERE candidate_id = ?',
          [votes, voteShare, c.candidate_id]
        );
        // attach computed vote_share to returned object (ensure numeric)
        c.vote_share = voteShare;
        c.votes = votes;
      }
  
      // determine winner (null if no votes)
      let winnerCandidateId = null;
      if (candidates.length > 0 && totalVotes > 0 && Number(candidates[0].votes) > 0) {
        winnerCandidateId = candidates[0].candidate_id;
      }
  
      // update winner_candidate_id (can be null)
      await db.query(
        'UPDATE elections SET winner_candidate_id = ? WHERE election_id = ?',
        [winnerCandidateId, electionId]
      );
  
      const [electionRows] = await db.query(
        'SELECT * FROM elections WHERE election_id = ?',
        [electionId]
      );
      const election = electionRows[0] || null;
  
      res.status(200).json({
        status: 'success',
        data: {
          election,
          candidates,
          totalVotes,
        },
      });
    }),

  deleteElection: catchAsync(async function (req, res) {
    // Delete an election (admin only)

    const electionId = req.params.id;
    await db.query('DELETE FROM elections WHERE election_id = ?', [electionId]);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }),
};

export default electionController;
