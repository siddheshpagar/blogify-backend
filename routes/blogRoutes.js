import express from 'express';
import multer from 'multer';
import { addBlog, deleteBlogById, editBlogById, getAllBlogs, getBlogById, getBlogsByUser } from '../controllers/blogController.js';
import authUserMiddleware from '../middleware/authUserMiddleware.js';
import authAdminMiddleware from '../middleware/authAdminMiddleware.js';

const blogRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, 'uploads/blogsImg');
    },
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}-${file.originalname}`);//${path.extname(file.originalname)}
    }
});

const upload = multer({ storage });

blogRouter.get('/', getAllBlogs); // View all blogs
blogRouter.get('/user', authUserMiddleware, getBlogsByUser); // View blogs by user_ID
blogRouter.post('/', authUserMiddleware, upload.single('image'), addBlog);// Add a new blog
blogRouter.put('/:id', authUserMiddleware, upload.single('image'), editBlogById);// Edit blog by blog ID
blogRouter.delete('/deleteblog/:id', authUserMiddleware, deleteBlogById);
blogRouter.delete('/admin/blogs/:id', authAdminMiddleware, deleteBlogById);
blogRouter.get('/:id',authUserMiddleware, getBlogById);// get blog by blogID



export default blogRouter;