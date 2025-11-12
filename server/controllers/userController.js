import catchAsync from '../utils/catchAsync.js';
import db from '../utils/db.js';

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// throw a new error using: return next(new AppError('message', statusCode));

const userController = {
  getAllUsers: catchAsync(async (req, res, next) => {
    // Get list of all users (admin only)
    const [users] = await db.query('SELECT * FROM users');
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  }),

  registerUser: catchAsync(async (req, res, next) => {
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: 'voter',
    };
    // Create a new user
    await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [newUser.name, newUser.email, newUser.password, newUser.role]
    );

    createSendToken(newUser, 201, req, res);
  }),

  loginUser: catchAsync(async (req, res, next) => {
    const { username, email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }
    // 2) Check if user exists && password is correct
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [
      email,
    ]);

    if (!user)
      user = await db.query('SELECT * FROM users WHERE username = ?', [
        username,
      ]);

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, req, res);
  }),

  getUserProfile: (req, res, next) => {
    req.params.id = req.user.id;
    next();
  },

  updateUserProfile: catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email', 'username');

    // 3) Update user document
    const updatedUser = await db.query('UPDATE users SET ? WHERE user_id = ?', [
      filteredBody,
      req.user.id,
    ]);

    updatedUser.password = undefined;

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  }),

  blockUser: catchAsync(async (req, res, next) => {
    // Block or deactivate a user (admin only)

    res.status(200).json({
      status: 'success',
      data: {
        message: `You accessed ${req.originalUrl}`,
      },
    });
  }),
};

export default userController;
