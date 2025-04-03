import 'dotenv/config';
import express, { request, response } from 'express';
import cors from 'cors';
import { ConnectDb } from './databaseConnection/config/db.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import likeRouter from './routes/likeRoutes.js';
import blogRouter from './routes/blogRoutes.js';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT;
// const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;

const app = express();

// Setting up CORS to allow frontend to make requests
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true, // Allow cookies
}));


// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serving blog images from the uploads/blogsImg directory
app.use('/blog-pics', express.static('uploads/blogsImg'));

app.use(cookieParser());

//initializing the database connection
const LoadDB = async () => {
    await ConnectDb();
}

// routes for admin-related operations
app.use("/admin", adminRouter);

// routes for user-related operations
app.use("/user", userRouter);

// routes for blog-related operations
app.use("/blog", blogRouter);

// routes for blog-likes-related operations
app.use("/like", likeRouter);

// Starting the server and connect to the database
app.listen(PORT, () => {
    LoadDB();
    console.log("server started at port " + PORT);
});