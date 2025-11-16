import db from './../utils/db.js';
import catchAsync from '../utils/catchAsync.js';

const candidateController = {
  // ==============================
  // 1. LIST ALL CANDIDATES
  // ==============================
  listAllCandidates: catchAsync(async function (req, res) {
    const [rows] = await db.query(`
      SELECT c.*, u.name, u.avatar_url
      FROM candidates c
      JOIN users u ON c.username = u.username
    `);

    res.status(200).json({
      status: 'success',
      results: rows.length,
      data: rows,
    });
  }),

  // ==============================
  // 2. GET CANDIDATE BY ID
  // ==============================
  getDetailOfCandidate: catchAsync(async function (req, res) {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT c.*, u.name, u.avatar_url 
       FROM candidates c
       JOIN users u ON c.username = u.username
       WHERE candidate_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: `Candidate with id ${id} not found`,
      });
    }

    res.status(200).json({ status: 'success', data: rows[0] });
  }),

  // ==============================
  // 3. GET ALL CANDIDATES FOR AN ELECTION
  // ==============================
  getAllCandidates: catchAsync(async function (req, res) {
    const election_id = req.params.electionId;
    // console.log("id:" , election_id);
    const [rows] = await db.query(
      `SELECT c.*, u.name, u.avatar_url 
       FROM candidates c
       JOIN users u ON c.username = u.username
       WHERE c.election_id = ?`,
      [election_id]
    );

    res.status(200).json({
      status: 'success',
      results: rows.length,
      data: rows,
    });
  }),

  // ==============================
  // 4. ADD NEW CANDIDATE
  // ==============================
  addNewCandidate: catchAsync(async function (req, res) {
    const { election_id, username, party, votes, vote_share } = req.body;

    if (!election_id || !username || !party) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing fields (election_id, username, party)',
      });
    }

    // Ensure user exists
    const [user] = await db.query(
      'SELECT username FROM users WHERE username = ?',
      [username]
    );

    if (user.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'User does not exist',
      });
    }

    // Ensure user is not already a candidate
    const [existing] = await db.query(
      'SELECT * FROM candidates WHERE election_id = ? AND username = ?',
      [election_id, username]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already a candidate in this election',
      });
    }

    const [result] = await db.query(
      `INSERT INTO candidates (election_id, username, party, votes, vote_share)
       VALUES (?, ?, ?, ?, ?)`,
      [
        election_id,
        username,
        party,
        votes ? Number(votes) : 0,
        vote_share ? Number(vote_share) : 0.0,
      ]
    );

    const [candidate] = await db
      .query(
        `SELECT c.*, u.name, u.avatar_url 
       FROM candidates c
       JOIN users u ON c.username = u.username
       WHERE candidate_id = ?`,
        [result.insertId]
      )
      .then((results) => results[0]);

    res.status(201).json({
      status: 'success',
      message: 'Candidate added successfully',
      data: {
        candidate,
      },
    });
  }),

  // ==============================
  // 5. UPDATE CANDIDATE
  // ==============================
  updateCandidate: catchAsync(async function (req, res) {
    const { id } = req.params;
    const { party, votes, vote_share } = req.body;

    const [result] = await db.query(
      `UPDATE candidates 
       SET party = ?, votes = ?, vote_share = ?
       WHERE candidate_id = ?`,
      [party, votes, vote_share, id]
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

  // ==============================
  // 6. DELETE CANDIDATE
  // ==============================
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
