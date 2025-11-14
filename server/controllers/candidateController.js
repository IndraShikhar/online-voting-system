import db from "./../utils/db.js";

const candidateController = {
  // 1. Get list of all candidates
  async listAllCandidates(req, res) {
    try {
      const [rows] = await db.query("SELECT * FROM candidates");
      res.status(200).json({
        status: "success",
        results: rows.length,
        data: rows,
      })
    } catch (error) {
      console.error("Error fetching candidates:", error);
      res.status(500).json({ status: "error", message: "Server error" });
    }
  },

  // 2. Get details of a specific candidate by ID
  async getDetailOfCandidate(req, res) {
    try {
      const {id} = req.params;
      const [rows] = await db.query(
        "select * from candidates where candidate_id = ?", [id]
      )

      if (rows.length === 0) {
        return res.status(404).json({
          status: "fail",
          message: `Candidate with id ${id} not found`,
        });
      }

      res.status(200).json({
        status: "success",
        data: rows[0],
      });
    } catch (error) {
      console.error("Error fetching candidate:", error);
      res.status(500).json({ status: "error", message: "Server error" });
    }
  },

  // 3. Get all candidates for a specific election
  async getAllCandidates(req, res) {
    try {
      const { election_id } = req.params;
      const [rows] = await db.query(
        "SELECT * FROM candidates WHERE election_id = ?",
        [election_id]
      );

      res.status(200).json({
        status: "success",
        results: rows.length,
        data: rows,
      });
    } catch (error) {
      console.error("Error fetching election candidates:", error);
      res.status(500).json({ status: "error", message: "Server error" });
    }
  },

  // 4. Add a new candidate (Admin only)
  async addNewCandidate(req, res) {
    try {
      const { election_id, name, party, avatar_url, votes, vote_share } =
        req.body;

      if (!election_id || !name || !party) {
        return res.status(400).json({
          status: "fail",
          message: "Missing required fields (election_id, name, party)",
        });
      }

      const [result] = await db.query(
        "INSERT INTO candidates (election_id, name, party, avatar_url, votes, vote_share) VALUES (?, ?, ?, ?, ?, ?)",
        [election_id, name, party, avatar_url || null, votes || 0, vote_share || 0.0]
      );

      res.status(201).json({
        status: "success",
        message: "Candidate added successfully",
        candidate_id: result.insertId,
      });
    } catch (error) {
      console.error("Error adding candidate:", error);
      res.status(500).json({ status: "error", message: "Server error" });
    }
  },

  // 5. Update candidate details (Admin only)
  async updateCandidate(req, res) {
    try {
      const { id } = req.params;
      const { name, party, avatar_url, votes, vote_share } = req.body;

      const [result] = await db.query(
        "UPDATE candidates SET name = ?, party = ?, avatar_url = ?, votes = ?, vote_share = ? WHERE candidate_id = ?",
        [name, party, avatar_url, votes, vote_share, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: "fail",
          message: `Candidate with id ${id} not found`,
        });
      }

      res.status(200).json({
        status: "success",
        message: "Candidate updated successfully",
      });
    } catch (error) {
      console.error("Error updating candidate:", error);
      res.status(500).json({ status: "error", message: "Server error" });
    }
  },

  //6. Delete candidate (Admin only)
  async deleteCandidate(req, res) {
    try {
      const { id } = req.params;
      const [result] = await db.query(
        "DELETE FROM candidates WHERE candidate_id = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: "fail",
          message: `Candidate with id ${id} not found`,
        });
      }

      res.status(200).json({
        status: "success",
        message: "Candidate deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting candidate:", error);
      res.status(500).json({ status: "error", message: "Server error" });
    }
  },
};

export default candidateController;





