import bcrypt from 'bcrypt';
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { User } from '../databaseConnection/models/User.js';
import jwt from 'jsonwebtoken';

const JWT_USER_SECRET = process.env.JWT_USER_SECRET; // Access from .env

/* User sign up */
export const signUpUser = async (request, response) => {
    try {
        const { name, email, password, designation } = request.body;

        // Check whether all required fields are provided or not 
        if (!name || !email || !password || !designation) {
            return response.status(StatusCodes.BAD_REQUEST).send({
                message: "All fields are required.",
            });
        }

        // Hash the password before saving it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the user in database
        const user = new User({
            name,
            email,
            password: hashedPassword,
            designation,
        });

        await user.save();

        // Successful response
        response
            .status(StatusCodes.CREATED)
            .send({ message: "User Signup successfully" });
    } catch (error) {
        // if duplicate email found send error
        if (
            error.code === 11000 && error.keyPattern?.email
        ) {
            return response.status(StatusCodes.CONFLICT).send({
                message: "Email is already registered. Please use a different email.",
            });
        }

        // Handle unexpected errors
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        });
    }
};

/* User login */
export const loginUser = async (request, response) => {
    try {
        const user = await User.findOne({ email: request.body.email });
        if (user) {
            if (!user.isBlocked) {
                // Check if password is correct or not
                const isPasswordValid = await bcrypt.compare(request.body.password, user.password);
                if (isPasswordValid) {
                    // Generating a JWT token 
                    const token = jwt.sign(
                        { useremail: user.email, id: user._id },
                        JWT_USER_SECRET,
                        // { expiresIn: '1h' }
                    );

                    // Setting the token in a cookie
                    // response.cookie('userToken', token, {
                    //     httpOnly: false,  // Makes it not accessible to client side script
                    //     secure: process.env.NODE_ENV === 'production', // Ensure secure cookies in production
                    //     sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                    //     domain: process.env.NODE_ENV === 'production' ? "blogify-frontend-4sur.onrender.com" : 'localhost',
                    //     path: "/",
                    // });

                    return response.status(StatusCodes.OK).send({
                        message: "Login Successfull",
                        token,
                    });
                }
                else {
                    return response.status(StatusCodes.UNAUTHORIZED).send({ message: "Invalid Password" });
                }
            } else {
                return response.status(StatusCodes.FORBIDDEN).send({ message: "Access denied. Your account has been blocked. contact admin" });
            }
        }
        else {
            return response.status(StatusCodes.UNAUTHORIZED).send({ message: "Invalid email" });
        }
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    }
}

/* Fetch user details */
export const getUserDetail = async (request, response) => {
    try {
        const userId = request.userId;
        const user = await User.findById(userId, { password: 0 });
        return response.status(StatusCodes.OK).send({ user });
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
}

/* User logout */
export const logoutUser = async (request, response) => {
    response.clearCookie("userToken", { path: "/" });
    return response.status(StatusCodes.OK).send({ message: "you have been successfully logged out." });
}