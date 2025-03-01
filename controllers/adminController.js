import bcrypt from 'bcrypt';
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { Admin } from "../databaseConnection/models/Admin.js";
import jwt from 'jsonwebtoken';
import User from '../databaseConnection/models/User.js';

const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET; // Access from .env

/* Admin sign up code starts here */
export const signUpAdmin = async (request, response) => {
    try {
        const { name, email, password } = request.body;

        if (!name || !email || !password) {
            return response.status(StatusCodes.BAD_REQUEST).send({
                message: "All fields are required.",
            });
        }

        // reqData["password"] = await bcrypt.hash(reqData.password, 10); //reqData["password"] = bcrypt.hashSync(reqData.password, 10);
        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new Admin({
            name,
            email,
            password: hashedPassword,
        });
        await admin.save();
        return response.status(StatusCodes.CREATED).send({
            message: "Admin Signup successfully"
        });
    } catch (error) {
        //if error exist send the error
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return response.status(StatusCodes.CONFLICT).send({
                message: "Email is already registered. Please use a different email."
            });
        }
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
}
/* Admin sign up code ends here */

/* Admin login code starts here */
export const loginAdmin = async (request, response) => {
    try {
        const admin = await Admin.findOne({ email: request.body.email });
        if (admin) {
            const isPasswordValid = await bcrypt.compare(request.body.password, admin.password)
            if (isPasswordValid) {
                const token = jwt.sign(
                    { adminemail: admin.email, id: admin._id },
                    JWT_ADMIN_SECRET,
                    // { expiresIn: '1h' }
                );

                // Setting JWT token in the cookie
                response.cookie('adminToken', token, {
                    httpOnly: true,  // Makes it accessible only by the web server
                    secure: process.env.NODE_ENV === 'production', // Ensure secure cookies in production
                    maxAge: 60 * 60 * 1000 // Cookie expires in 2 min
                });

                return response.status(StatusCodes.OK).send({
                    message: "Login Successfull",
                });
            }
            else {
                return response.status(StatusCodes.UNAUTHORIZED).send({
                    message: "Invalid Password",
                });
            }
        }
        else {

            return response.status(StatusCodes.UNAUTHORIZED).send({
                message: "Invalid email"
            });
        }
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
}
/* Admin login code ends here */

/* block and unblock user code starts here */
export const setBlockStatusById = async (request, response) => {
    try {
        const userId = request.params.id;
        const { isBlocked } = request.body;
        const user = await User.findById(userId);
        // console.log(user);
        if (!user) {
            return response.status(StatusCodes.NOT_FOUND).send({
                message: "User not found"
            });
        }

        user.isBlocked = isBlocked;
        await user.save();

        return response.status(StatusCodes.OK).send({
            user: user,
            message: `User with ID ${userId} has been ${isBlocked ? "blocked" : "unblocked"} successfully.`
        });
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
}
/* block and unblock user code ends here */

/* Fetch all users code starts here */
export const getAllUsers = async (request, response) => {
    try {
        const users = await User.find({}, { password: 0 });
        return response.status(StatusCodes.OK).send({
            message: "Users fetched successfully",
            users
        });
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Error fetching users"
        });
    }
};
/* Fetch all users code ends here */
export const getAdminDetail = async (request, response) => {
    try {

        const adminId = request.adminId;
        const admin = await Admin.findById(adminId, { password: 0 });
        return response.status(StatusCodes.OK).send({ admin });
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
}
export const logoutAdmin = async (request, response) => {
    response.clearCookie("adminToken", { path: "/" });
    return response.status(StatusCodes.OK).send({ message: "you have been successfully logged out." });
}
