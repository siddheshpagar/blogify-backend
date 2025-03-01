import jwt from 'jsonwebtoken';
import { Admin } from '../databaseConnection/models/Admin.js';
import { getReasonPhrase, StatusCodes } from "http-status-codes";

const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET; // Access from .env

/* jwt token verification code starts here */
function authAdminMiddleware(request, response, next) {
    const token = request.cookies?.adminToken;

    if (token) {
        // const token = header.split(" ")[1];
        jwt.verify(token, JWT_ADMIN_SECRET, async (error, payload) => {
            if (error) {
                return response.status(StatusCodes.UNAUTHORIZED).send({
                    message: "Invalid Token"
                });
            } else {
                const { id } = payload;
                try {
                    const admin = await Admin.findById(id);
                    if (!admin) {
                        return response.status(StatusCodes.NOT_FOUND).send({
                            message: "You are not a admin or account has been deleted permanently"
                        });
                    }
                    request.adminId=id;
                    next();
                } catch (error) {
                    return response.status(StatusCodes.INTERNAL_SERVER_ERROR)
                        .send({
                            message: "Internal Server Error"
                        });
                }
            }

        });
    } else {
       return response.status(StatusCodes.UNAUTHORIZED).send({ message: "Please Login First" });
    }
}

export default authAdminMiddleware;
/* jwt token verification code ends here */
