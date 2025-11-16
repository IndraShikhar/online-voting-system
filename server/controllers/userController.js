import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import db from '../utils/db.js';
import createSendToken from '../utils/jwt.js';
import { isCorrectPassword, filterObj } from '../utils/utils.js';
import { uploadBufferToCloudinary } from '../utils/uploadToCloudinary.js';

const userController = {
  // ==============================
  // 1. GET ALL USERS
  // ==============================
  getAllUsers: catchAsync(async (req, res, next) => {
    const [users] = await db.query(
      'SELECT user_id, username, email, avatar_url, name, role FROM users'
    );

    res.status(200).json({
      status: 'success',
      data: {
        results: users.length,
        users,
      },
    });
  }),

  // ==============================
  // 2. REGISTER USER
  // ==============================
  registerUser: catchAsync(async (req, res, next) => {
    console.log('Calling register user method:');
    console.log(req);
    const { username, name, email, password } = req.body;

    // Insert into DB
    let avatar_url =
      'https://res.cloudinary.com/dn8ofrxix/image/upload/v1763201582/users_avatars/lbdmmsl8vd6boyzw68yk.jpg';
    await db.query(
      `INSERT INTO users (username, name, email, password, avatar_url, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, name, email, password, avatar_url, 'voter']
    );

    const newUser = { username, name, email, avatar_url, role: 'voter' };

    // console.log("Everything well till now.");

    createSendToken(newUser, 201, req, res);
  }),

  // ==============================
  // 3. LOGIN USER
  // ==============================
  loginUser: catchAsync(async (req, res, next) => {
    const { username, password } = req.body;

    const [user] = await db
      .query('SELECT * FROM users WHERE email = ? OR username = ?', [
        username,
        username,
      ])
      .then((results) => results[0]);

    if (!user || !(await isCorrectPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    createSendToken(user, 200, req, res);
  }),

  logoutUser: (req, res) => {
    // Overwrite the cookie with a short-lived dummy value to remove it from the browser
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({ status: 'success', message: 'Logged out' });
  },

  getUserProfile: (req, res, next) => {
    req.user.password = undefined;

    res.status(200).json({
      status: 'success',
      data: { user: req.user },
    });
  },

  // ==============================
  // 5. UPDATE USER PROFILE
  // ==============================
  updateUserProfile: catchAsync(async (req, res, next) => {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);

    // Stop password changes
    if (req.body.password) {
      return next(new AppError('This route is not for password updates.', 400));
    }

    const allowed = ['name', 'email'];
    const filteredBody = filterObj(req.body, ...allowed);

    let avatar_url;

    // File upload
    if (req.file?.buffer) {
      try {
        const result = await uploadBufferToCloudinary(req.file.buffer, {
          folder: 'users_avatars',
          resource_type: 'image',
        });
        avatar_url = result.secure_url;
        filteredBody.avatar_url = avatar_url;
      } catch (err) {
        return next(new AppError('Avatar upload failed', 500));
      }
    }

    // Update user
    await db.query('UPDATE users SET ? WHERE user_id = ?', [
      filteredBody,
      req.user.user_id,
    ]);

    // Return updated user
    const [rows] = await db.query(
      'SELECT user_id, username, email, name, avatar_url, role FROM users WHERE user_id = ?',
      [req.user.user_id]
    );

    res.status(200).json({
      status: 'success',
      data: { user: rows[0] },
    });
  }),

  // ==============================
  // 6. BLOCK USER
  // ==============================
  blockUser: catchAsync(async (req, res, next) => {
    const username = req.params.username; // updated
    const banned_by = req.user.username; // updated
    const election_id = req.body.election_id || null;
    const reason = req.body.reason || null;
    const ban_type = election_id ? 'election' : 'permanent';

    // Insert into bans
    await db.query(
      `INSERT INTO bans (username, banned_by, election_id, reason, ban_type)
       VALUES (?, ?, ?, ?, ?)`,
      [username, banned_by, election_id, reason, ban_type]
    );

    res.status(200).json({
      status: 'success',
      data: {
        message: `User '${username}' has been blocked.`,
        banned_by,
        election_id,
        reason,
        ban_type,
      },
    });
  }),

  unblockUser: catchAsync(async (req, res, next) => {
    const userID = req.params.userId;

    // Delete from bans
    await db.query('DELETE FROM bans WHERE user_id = ?', [userID]);

    const [user] = await db
      .query('SELECT username FROM users WHERE user_id = ?', [userID])
      .then((results) => results[0]);

    user.password = undefined;

    res.status(200).json({
      status: 'success',
      data: {
        message: `User '${user.username}' has been unblocked.`,
        user,
      },
    });
  }),

  deleteUser: catchAsync(async (req, res, next) => {
    const userID = req.params.userId;

    const [user] = await db
      .query('SELECT username FROM users WHERE user_id = ?', [userID])
      .then((results) => results[0]);

    const username = user.username;
    // Delete from users
    await db.query('DELETE FROM users WHERE user_id = ?', [userID]);

    res.status(204).json({
      status: 'success',
      data: {
        message: `User '${username}' has been deleted.`,
      },
    });
  }),
};

export default userController;
