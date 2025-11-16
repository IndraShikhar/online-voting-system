import express from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const userRouter = express.Router();

userRouter.post('/register', userController.registerUser);
userRouter.post('/login', userController.loginUser);
userRouter.post('/logout', userController.logoutUser);

userRouter.use(authMiddleware.protect);

userRouter.get('/profile', userController.getUserProfile);
userRouter.put(
  '/profile',
  upload.single('avatar'), // 'avatar' is the key you send in Postman
  userController.updateUserProfile
);

userRouter.use(authMiddleware.restrictTo('admin'));

userRouter.get('/all', userController.getAllUsers);
userRouter.patch('/block/:userId', userController.blockUser);
userRouter.patch('/unblock/:userId', userController.unblockUser);
userRouter.delete('/delete/:userId', userController.deleteUser);

export default userRouter;
