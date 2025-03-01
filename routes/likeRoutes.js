import express from 'express';
import { likeBlog, unlikeBlog } from '../controllers/likeController.js';

const likeRouter = express.Router();

likeRouter.post("/", likeBlog);
likeRouter.delete("/", unlikeBlog);

export default likeRouter;