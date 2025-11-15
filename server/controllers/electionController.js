import catchAsync from '../utils/catchAsync.js';
import db from '../utils/db.js';
import { toMySQLDate } from '../utils/utils.js';

const electionController = {
  createNewElection: catchAsync(async (req, res) => {
    // Create a new election (admin only)
    const { title, description, start_time, end_time } = req.body;

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
    // Declare results (admin only)
    const electionId = req.params.id;
    await db.query('UPDATE elections SET status = ? WHERE election_id = ?', [
      'result_declared',
      electionId,
    ]);

    // Calculate vote of each candidate in the election and find out the one with highest votes
    const [candidates] = await db.query(
      'SELECT candidate_id, name, votes FROM candidates WHERE election_id = ?',
      [electionId]
    );
    let winnerCandidateId = null;
    let maxVotes = -1;
    candidates.forEach((candidate) => {
      if (candidate.votes > maxVotes) {
        maxVotes = candidate.votes;
        winnerCandidateId = candidate.candidate_id;
      }
    });

    // Update winner_candidate_id in elections table
    await db.query(
      'UPDATE elections SET winner_candidate_id = ? WHERE election_id = ?',
      [winnerCandidateId, electionId]
    );

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
