import express from 'express';
import { getUserDetail, loginUser, logoutUser, signUpUser } from '../controllers/userController.js';
import authUserMiddleware from '../middleware/authUserMiddleware.js';

const userRouter = express.Router();

userRouter.post("/", signUpUser);
userRouter.post("/login", loginUser);
userRouter.get('/details', authUserMiddleware, getUserDetail);
userRouter.post('/logout', authUserMiddleware, logoutUser);

export default userRouter;
