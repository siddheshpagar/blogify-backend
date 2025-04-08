import Like from "../databaseConnection/models/Like.js";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

/* like to a Blog code starts here */
export const likeBlog = async (request, response) => {
    const { userId, blogId } = request.body;
    try {
        const blog = 10; //= await Blog.findById(blogId);
        if (!blog) {
            return response.status(StatusCodes.BAD_REQUEST).send({ message: "Blog not found" });
        }
        const like = await Like.create({ user_ID: userId, blog_ID: blogId });
        return response.status(StatusCodes.CREATED).send({ message: 'Blog liked successfully', like });
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    }
}
/* like to a Blog code ends here */



/* unLike to a Blog code starts here */
export const unlikeBlog = async (request, response) => {
    try {
        const { userId, blogId } = request.body;
        const like = await Like.findOneAndDelete({ user_ID: userId, blog_ID: blogId });
        return response.status(StatusCodes.OK).send({ message: 'Blog unliked successfully', like });
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    }
}
/* unLike to a Blog code ends here */
