import db from '../utils/db.js';

const userController = {
  async getAllUsers(req, res) {
    // Get list of all users (admin only)
    try {
      const [users] = await db.query('SELECT * FROM users');
      res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
          users,
        },
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ status: 'error', message: 'Error fetching users' });
    }
  },

  registerUser(req, res) {
    // Register a new user (voter/admin)

    res.status(200).json({
      status: 'success',
      data: {
        message: `You accessed ${req.originalUrl}`,
      },
    });
  },
  loginUser(req, res) {
    // Login and get JWT token

    res.status(200).json({
      status: 'success',
      data: {
        message: `You accessed ${req.originalUrl}`,
      },
    });
  },
  getUserProfile(req, res) {
    // Get logged-in user's details

    res.status(200).json({
      status: 'success',
      data: {
        message: `You accessed ${req.originalUrl}`,
      },
    });
  },
  updateUserProfile(req, res) {
    // Update user's info (optional)

    res.status(200).json({
      status: 'success',
      data: {
        message: `You accessed ${req.originalUrl}`,
      },
    });
  },

  blockUser(req, res) {
    // Block or deactivate a user (admin only)

    res.status(200).json({
      status: 'success',
      data: {
        message: `You accessed ${req.originalUrl}`,
      },
    });
  },
};

export default userController;
