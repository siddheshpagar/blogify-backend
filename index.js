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
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;

const app = express();
app.use(cors(
    {
        origin: FRONTEND_ORIGIN, // Frontend origin
        credentials: true, // Allow credentials (cookies)
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.static("blogsImg"));
app.use('/blog-pics', express.static('uploads/blogsImg'));

app.use(cookieParser());
// creating connection with database 
const LoadDB = async () => {
    await ConnectDb();
}

// admin related routes
app.use("/admin", adminRouter);

//user related routes
app.use("/user", userRouter);

// blog related routes
app.use("/blog", blogRouter);

//likes related routes
app.use("/like", likeRouter);

app.listen(PORT, () => {
    LoadDB();
    console.log("server started at port "+PORT);
});