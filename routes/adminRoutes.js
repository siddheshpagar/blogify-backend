import express from 'express';
import { getAdminDetail, getAllUsers, loginAdmin, logoutAdmin, setBlockStatusById, signUpAdmin } from '../controllers/adminController.js';
import authAdminMiddleware from '../middleware/authAdminMiddleware.js';

const adminRouter = express.Router();

adminRouter.post("/", signUpAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.patch('/set-block-status/:id',authAdminMiddleware ,setBlockStatusById);
adminRouter.get('/users',authAdminMiddleware,getAllUsers);
adminRouter.get('/details',authAdminMiddleware,getAdminDetail);
adminRouter.post('/logout',authAdminMiddleware,logoutAdmin);

export default adminRouter;