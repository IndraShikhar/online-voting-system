import express from "express"
import userController from "../controllers/userController.js"
const router = express.Router();

router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);

router.get('/profile', userController.getUserProfile);

router.put('/profile', userController.updateUserProfile);

router.get('/all', userController.getAllUsers);

router.patch('/block/:userId', userController.blockUser);



export default router;