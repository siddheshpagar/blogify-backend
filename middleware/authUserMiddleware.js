import jwt from 'jsonwebtoken';
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import User from "../databaseConnection/models/User.js";

const JWT_USER_SECRET = process.env.JWT_USER_SECRET; // Access from .env

/* Middleware to verify user authentication */
function authUserMiddleware(request, response, next) {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return response.status(StatusCodes.UNAUTHORIZED).send({
            message: "Authorization token missing",
        });
    }

    const token = authHeader.split(" ")[1]; // Extracting token after "Bearer "

    jwt.verify(token, JWT_USER_SECRET, async (error, payload) => {
        if (error) {
            return response.status(StatusCodes.UNAUTHORIZED).send({
                message: "Invalid Token",
            });
        }

        const { id } = payload;

        try {
            const user = await User.findById(id);
            if (!user) {
                return response.status(StatusCodes.NOT_FOUND).send({
                    message: "You are not a user or account has been deleted permanently",
                });
            }

            request.userId = id;
            next();
        } catch (error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: "Internal Server Error",
            });
        }
    });
}

export default authUserMiddleware;

// function authUserMiddleware(request, response, next) {
//     const token = request.cookies?.userToken; // Get the token from cookies

//     if (token) {
//         // Verify the JWT token
//         jwt.verify(token, JWT_USER_SECRET, async (error, payload) => {
//             if (error) {
//                 // when verification fails, return unauthorized status and message
//                 response.status(StatusCodes.UNAUTHORIZED).send({
//                     message: "Invalid Token"
//                 });
//             } else {
//                 // Extracting id from token payload
//                 const { id } = payload;
//                 try {
//                     // check if the user with id exist in database
//                     const user = await User.findById(id);
//                     if (!user) {
//                         return response.status(StatusCodes.NOT_FOUND).send({
//                             message: "You are not a user or account has been deleted permanently"
//                         });
//                     }
//                     request.userId = id;
//                     // Proceed to route handler
//                     next();
//                 } catch (error) {
//                     return response.status(StatusCodes.INTERNAL_SERVER_ERROR)
//                         .send({
//                             message: "Internal Server Error"
//                         });
//                 }
//             }

//         });
//     } else {
//         // if token not present then tell user to login
//         response.status(StatusCodes.UNAUTHORIZED).send({ message: "Please Login First" });
//     }
// }

// export default authUserMiddleware;