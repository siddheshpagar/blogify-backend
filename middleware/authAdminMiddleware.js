import jwt from 'jsonwebtoken';
import { Admin } from '../databaseConnection/models/Admin.js';
import { getReasonPhrase, StatusCodes } from "http-status-codes";

const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET; // Access from .env

/* Middleware to verify admin authentication */

function authAdminMiddleware(request, response, next) {

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return response.status(StatusCodes.UNAUTHORIZED).send({
            message: "Authorization token missing",
        });
    }

    const token = authHeader.split(" ")[1]; // Extracting token after "Bearer "

    jwt.verify(token, JWT_ADMIN_SECRET, async (error, payload) => {
        if (error) {
            return response.status(StatusCodes.UNAUTHORIZED).send({
                message: "Invalid Token",
            });
        }

        const { id } = payload;
        try {
            const admin = await Admin.findById(id);
            if (!admin) {
                return response.status(StatusCodes.NOT_FOUND).send({
                    message: "You are not an admin or account has been deleted permanently",
                });
            }

            request.adminId = id;
            next();
        } catch (err) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: "Internal Server Error",
            });
        }
    });

}

export default authAdminMiddleware;

// function authAdminMiddleware(request, response, next) {
//     const token = request.cookies?.adminToken; // Get the token from cookies

//     if (token) {
//         // Verify the JWT token
//         jwt.verify(token, JWT_ADMIN_SECRET, async (error, payload) => {
//             if (error) {
//                 // when verification fails, return unauthorized status and message
//                 return response.status(StatusCodes.UNAUTHORIZED).send({
//                     message: "Invalid Token"
//                 });
//             } else {
//                 // Extracting id from token payload
//                 const { id } = payload;
//                 try {
//                     // check if the admin with id exist in database
//                     const admin = await Admin.findById(id);
//                     if (!admin) {
//                         return response.status(StatusCodes.NOT_FOUND).send({
//                             message: "You are not a admin or account has been deleted permanently"
//                         });
//                     }
//                     request.adminId=id;
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
//        return response.status(StatusCodes.UNAUTHORIZED).send({ message: "Please Login First" });
//     }
// }

// export default authAdminMiddleware;