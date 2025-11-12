import express from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register', userController.registerUser);
userRouter.post('/login', userController.loginUser);

userRouter.use(authMiddleware.protect);

userRouter.get('/profile', userController.getUserProfile);
userRouter.put('/profile', userController.updateUserProfile);

userRouter.use(authMiddleware.restrictTo('admin'));

userRouter.get('/all', userController.getAllUsers);
userRouter.patch('/block/:userId', userController.blockUser);

export default userRouter;
