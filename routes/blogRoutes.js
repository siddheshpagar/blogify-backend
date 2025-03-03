import express from 'express';
import multer from 'multer';
import {
    addBlog,
    deleteBlogById,
    editBlogById,
    getAllBlogs,
    getBlogById,
    getBlogsByUser
} from '../controllers/blogController.js';
import authUserMiddleware from '../middleware/authUserMiddleware.js';
import authAdminMiddleware from '../middleware/authAdminMiddleware.js';

const blogRouter = express.Router();

// Configure storage for uploaded blog images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, 'uploads/blogsImg');// Save images to uploads/blogsImg directory
    },
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}-${file.originalname}`);// Renaming file to avoid same name conflicts
    }
});

const upload = multer({ storage });// Initializing multer

// Route to fetch all blogs
blogRouter.get('/', getAllBlogs);

// fetch blogs created by the logged-in user
blogRouter.get('/user', authUserMiddleware, getBlogsByUser);

// Add a new blog 
blogRouter.post('/', authUserMiddleware, upload.single('image'), addBlog);

// edit a existing blog by its id
blogRouter.put('/:id', authUserMiddleware, upload.single('image'), editBlogById);

// Delete a blog by its id
blogRouter.delete('/deleteblog/:id', authUserMiddleware, deleteBlogById);

// delete any blog by its ID by admin
blogRouter.delete('/admin/blogs/:id', authAdminMiddleware, deleteBlogById);

// fetch a blog by its ID
blogRouter.get('/:id', authUserMiddleware, getBlogById);

export default blogRouter;