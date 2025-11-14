import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import db from '../utils/db.js';
import createSendToken from '../utils/jwt.js';
import { isCorrectPassword, filterObj } from '../utils/utils.js';

// throw a new error using: return next(new AppError('message', statusCode));

const userController = {
  getAllUsers: catchAsync(async (req, res, next) => {
    // Get list of all users (admin only)
    const [users] = await db.query(
      'SELECT user_id, username,email,name,role FROM users'
    );

    res.status(200).json({
      status: 'success',
      data: {
        results: users.length,
        users,
      },
    });
  }),

  registerUser: catchAsync(async (req, res, next) => {
    const newUser = {
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: 'voter',
    };
    // Create a new user
    await db.query(
      'INSERT INTO users (username, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [
        newUser.username,
        newUser.name,
        newUser.email,
        newUser.password,
        newUser.role,
      ]
    );

    createSendToken(newUser, 201, req, res);
  }),

  loginUser: catchAsync(async (req, res, next) => {
    console.log(req.body);

    const { username, email, password } = req.body;

    const [user] = await db
      .query('SELECT * FROM users WHERE email = ? OR username = ?', [
        email,
        username,
      ])
      .then((results) => results[0]);

    console.log(user, isCorrectPassword(password, user.password));

    if (!user || !(await isCorrectPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, req, res);
  }),

  getUserProfile: (req, res, next) => {
    // Get logged in user's profile

    req.user.password = undefined;

    res.status(200).json({
      status: 'success',
      data: {
        user: req.user,
      },
    });
  },

  updateUserProfile: catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password) {
      return next(new AppError('This route is not for password updates.', 400));
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email', 'username');

    // 3) Update user document
    const updatedUser = await db.query('UPDATE users SET ? WHERE user_id = ?', [
      filteredBody,
      req.user.user_id,
    ]);

    const [user] = await db
      .query('SELECT * FROM users WHERE user_id = ?', [req.user.user_id])
      .then((results) => results[0]);

    user.password = undefined;

    res.status(200).json({
      status: 'success',
      data: {
        user: user,
      },
    });
  }),

  blockUser: catchAsync(async (req, res, next) => {
    // 1) Get user ID from params
    const userId = req.params.userId;
    const banned_by = req.user.user_id;
    const election_id = req.body.election_id || null;
    const reason = req.body.reason || null;
    const ban_type = election_id ? 'election' : 'permanent';

    // 2) Insert user to bans table
    await db.query(
      'INSERT INTO bans (user_id, banned_by, election_id, reason, ban_type) VALUES (?, ?, ?, ?, ?)',
      [userId, banned_by, election_id, reason, ban_type]
    );

    // Block or deactivate a user (admin only)
    res.status(200).json({
      status: 'success',
      data: {
        message: `User with ID ${userId} has been blocked.`,
        data: {
          user_id: userId,
          banned_by,
          election_id,
          reason,
          ban_type,
        },
      },
    });
  }),
};

export default userController;
