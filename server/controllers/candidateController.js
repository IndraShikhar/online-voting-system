import catchAsync from '../utils/catchAsync.js';
import db from './../utils/db.js';

const candidateController = {
  // 1. Get list of all candidates
  listAllCandidates: catchAsync(async function (req, res) {
    const [rows] = await db.query('SELECT * FROM candidates');
    res.status(200).json({
      status: 'success',
      results: rows.length,
      data: rows,
    });
  }),

  // 2. Get details of a specific candidate by ID
  getDetailOfCandidate: catchAsync(async function (req, res) {
    const { id } = req.params;
    const [rows] = await db.query(
      'select * from candidates where candidate_id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: `Candidate with id ${id} not found`,
      });
    }

    res.status(200).json({
      status: 'success',
      data: rows[0],
    });
  }),

  // 3. Get all candidates for a specific election
  getAllCandidates: catchAsync(async function (req, res) {
    const election_id = req.params.electionId;
    const [rows] = await db.query(
      'SELECT * FROM candidates WHERE election_id = ?',
      [election_id]
    );

    res.status(200).json({
      status: 'success',
      results: rows.length,
      data: rows,
    });
  }),

  // 4. Add a new candidate (Admin only)
  addNewCandidate: catchAsync(async function (req, res) {
    const { election_id, name, party, avatar_url, votes, vote_share } =
      req.body;
    if (!election_id || !name || !party) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing required fields (election_id, name, party)',
      });
    }

    const [result] = await db.query(
      'INSERT INTO candidates (election_id, name, party, avatar_url, votes, vote_share) VALUES (?, ?, ?, ?, ?, ?)',
      [
        election_id,
        name,
        party,
        avatar_url || null,
        votes || 0,
        vote_share || 0.0,
      ]
    );

    res.status(201).json({
      status: 'success',
      message: 'Candidate added successfully',
      candidate_id: result.insertId,
    });
  }),

  // 5. Update candidate details (Admin only)
  updateCandidate: catchAsync(async function (req, res) {
    const { id } = req.params;
    const { name, party, avatar_url, votes, vote_share } = req.body;

    const [result] = await db.query(
      'UPDATE candidates SET name = ?, party = ?, avatar_url = ?, votes = ?, vote_share = ? WHERE candidate_id = ?',
      [name, party, avatar_url, votes, vote_share, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'fail',
        message: `Candidate with id ${id} not found`,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Candidate updated successfully',
    });
  }),

  //6. Delete candidate (Admin only)
  deleteCandidate: catchAsync(async function (req, res) {
    const { id } = req.params;
    const [result] = await db.query(
      'DELETE FROM candidates WHERE candidate_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'fail',
        message: `Candidate with id ${id} not found`,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Candidate deleted successfully',
    });
  }),
};

export default candidateController;
