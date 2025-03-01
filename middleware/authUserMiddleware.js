import jwt from 'jsonwebtoken';
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import User from "../databaseConnection/models/User.js";

const JWT_USER_SECRET = process.env.JWT_USER_SECRET; // Access from .env

/* jwt token verification code starts here */
function authUserMiddleware(request, response, next) {
    // const header = request.get('Authorization');// Getting the token that has been sent from the client
    // Getting the token from cookies
    const token = request.cookies?.userToken;

    if (token) {
        // const token = header.split(" ")[1];
        jwt.verify(token, JWT_USER_SECRET, async (error, payload) => {
            if (error) {
                response.status(StatusCodes.UNAUTHORIZED).send({
                    message: "Invalid Token"
                });
            } else {
                const { id } = payload;
                try {
                    const user = await User.findById(id);
                    if (!user) {
                        return response.status(StatusCodes.NOT_FOUND).send({
                            message: "You are not a user or account has been deleted permanently"
                        });
                    }
                    request.userId=id;
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
        response.status(StatusCodes.UNAUTHORIZED).send({ message: "Please Login First" });
    }
}

export default authUserMiddleware;
/* jwt token verification code ends here */
