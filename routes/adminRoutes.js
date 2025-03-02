import express from 'express';
import { getAdminDetail, getAllUsers, loginAdmin, logoutAdmin, setBlockStatusById, signUpAdmin } from '../controllers/adminController.js';
import authAdminMiddleware from '../middleware/authAdminMiddleware.js';

const adminRouter = express.Router();

// Route for admin signup
adminRouter.post("/", signUpAdmin);

// admin login
adminRouter.post("/login", loginAdmin);

// block/unblock user
adminRouter.patch('/set-block-status/:id', authAdminMiddleware, setBlockStatusById);

// get all users 
adminRouter.get('/users', authAdminMiddleware, getAllUsers);

// get loggedin admin details
adminRouter.get('/details', authAdminMiddleware, getAdminDetail);

// admin logout
adminRouter.post('/logout', authAdminMiddleware, logoutAdmin);

export default adminRouter;