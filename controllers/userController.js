import bcrypt from 'bcrypt';
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { User } from '../databaseConnection/models/User.js';
import jwt from 'jsonwebtoken';

const JWT_USER_SECRET = process.env.JWT_USER_SECRET; // Access from .env

/* User sign up code starts here */
export const signUpUser = async (request, response) => {
    try {
        // console.log("Cookies in signup request:", request.cookies);
        const { name, email, password, designation } = request.body;

        if (!name || !email || !password || !designation) {
            return response.status(StatusCodes.BAD_REQUEST).send({
                message: "All fields are required.",
            });
        }

        // Hash the password
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
        // Handle duplicate email error
        if (
            error.code === 11000 && error.keyPattern?.email
        ) {
            return response.status(StatusCodes.CONFLICT).send({
                message: "Email is already registered. Please use a different email.",
            });
        }

        // Handle unexpected errors
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        });
    }
};
/* User sign up code ends here */
/*
export const signUpUser = async (request, response) => {
    try {
        const reqData = request.body;
        reqData["password"] = await bcrypt.hash(reqData.password, 10);
        const user = new User(reqData);
        await user.save();
        response.status(StatusCodes.CREATED).send({ message: "User Signup successfully" });
    } catch (error) {
        //if user with same email exist send error with these message
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return response.status(StatusCodes.CONFLICT).send({
                message: "Email is already registered. Please use a different email."
            });
        }
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
}
*/


/* User login code starts here */
export const loginUser = async (request, response) => {
    try {
        // console.log("Cookies in request:", request.cookies);
        const user = await User.findOne({ email: request.body.email });
        if (user) {
            if (!user.isBlocked) {
                const isPasswordValid = await bcrypt.compare(request.body.password, user.password);
                if (isPasswordValid) {
                    // const token = jwt.sign({ useremail: user.email }, "userjwt");//generate token
                    const token = jwt.sign(
                        { useremail: user.email, id: user._id }
                        , JWT_USER_SECRET
                        // , { expiresIn: '1h' }
                    );

                    // Set the JWT token in the cookie
                    response.cookie('userToken', token, {
                        httpOnly: true,  // Makes it accessible only by the web server
                        secure: process.env.NODE_ENV === 'production', // Ensure secure cookies in production
                        // maxAge: 5 * 60 * 1000 // Cookie expires in 5 min
                    });

                    response.status(StatusCodes.OK).send({
                        message: "Login Successfull",
                    });
                }
                else {
                    response.status(StatusCodes.UNAUTHORIZED).send({ message: "Invalid Password" });
                }
            } else {
                response.status(StatusCodes.FORBIDDEN).send({ message: "Access denied. Your account has been blocked. contact admin" });
            }
        }
        else {
            response.status(StatusCodes.UNAUTHORIZED).send({ message: "Invalid email" });
        }
    } catch (error) {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    }
}
/* User login code ends here */

/* code to get details of user starts here */
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
/* code to get details of user starts here */

/* code to logout user starts from here */
export const logoutUser = async (request, response) => {
    response.clearCookie("userToken", { path: "/" });
    return response.status(StatusCodes.OK).send({ message: "you have been successfully logged out." });
}
/*code to logout user ends here */
