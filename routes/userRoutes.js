import express from 'express';
import { getUserDetail, loginUser, logoutUser, signUpUser } from '../controllers/userController.js';
import authUserMiddleware from '../middleware/authUserMiddleware.js';

const userRouter = express.Router();

// Route for user signup
userRouter.post("/", signUpUser);

// user login
userRouter.post("/login", loginUser);

// get loggedin user details protected requires authentication 
userRouter.get('/details', authUserMiddleware, getUserDetail);

// user logout
userRouter.post('/logout', authUserMiddleware, logoutUser);

export default userRouter;
