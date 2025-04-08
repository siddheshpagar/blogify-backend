import { getReasonPhrase, StatusCodes } from "http-status-codes";
import Blog from "../databaseConnection/models/BlogModel.js";
import fs from 'fs';
import path from "path";
import mongoose from "mongoose";

/* Fetch all blogs */
export const getAllBlogs = async (request, response) => {
  try {
    const blogs = await Blog.find();
    return response.status(StatusCodes.OK).send({ blogs });
  } catch (error) {
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  }
}

/* Fetch blogs created by logged-in user */
export const getBlogsByUser = async (request, response) => {
  const user_ID = request.userId;
  try {
    const blogs = await Blog.find({ user_ID });
    if (blogs.length === 0) {
      return response.status(StatusCodes.NOT_FOUND)
        .send({ message: 'You have created 0 blogs' });
    }
    return response.status(StatusCodes.OK).send({ blogs });
  } catch (error) {
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({
        message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
      })
  }
};

/* Fetch a blog by its ID */
export const getBlogById = async (request, response) => {
  try {
    const { id } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(StatusCodes.BAD_REQUEST).send({ message: "Invalid Blog ID" });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return response.status(StatusCodes.NOT_FOUND).send({ message: 'Blog not found' });
    }
    return response.status(StatusCodes.OK).send({ blog });
  } catch (error) {
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  }
}

/* Create a new blog */
export const addBlog = async (request, response) => {
  try {
    const {
      title,
      description,
      category,
      author,
    } = request.body;
    const image = request.file ? path.basename(request.file.path) : ''; // Extract only the file name
    const userId = request.userId;

    const newBlog = new Blog({
      user_ID: userId,
      title,
      description,
      category,
      author,
      image
    });

    const blog = await newBlog.save();
    return response.status(StatusCodes.CREATED).send({
      blog: blog,
      message: "blog created successfully"
    });
  } catch (error) {
    console.log(error);
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  }
}

/* Update an existing blog and delete the old image */
export const editBlogById = async (request, response) => {
  const { id } = request.params;
  const { title, description, category, author } = request.body;
  const userId = request.userId;

  let updatedBlog = { title, description, category, author };

  try {
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return response.status(StatusCodes.NOT_FOUND).send({ message: 'Blog not found' });
    }

    // Ensure only the blog owner can update it
    if (existingBlog.user_ID.toString() !== userId) {
      return response
        .status(StatusCodes.FORBIDDEN)
        .send({ message: "You are not authorized to edit this blog" });
    }


    if (request.file) {
      const oldImagePath = existingBlog.image;//old image path
      updatedBlog.image = path.basename(request.file.path);

      // Delete old image
      fs.unlink(`uploads\\blogsImg\\${oldImagePath}`, (error) => {
        if (error) {
          console.error(`Error deleting old image: ${error.message}`);
        } else {
          console.log(`Old image ${oldImagePath} deleted successfully`);
        }
      });
    } else {
      updatedBlog.image = existingBlog.image;
    }
    const blog = await Blog.findByIdAndUpdate(id, updatedBlog, { new: true });// Update the blog and send new updated data
    return response.status(StatusCodes.OK).send({
      blog,
      message: "Your blog has been successfully updated!",
    });
  } catch (error) {
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  }
}

/* Delete a blog by its id and remove the blog image */
export const deleteBlogById = async (request, response) => {
  const { id } = request.params;

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return response.status(StatusCodes.NOT_FOUND)
        .json({
          message: 'Blog you are trying to delete does not exist'
        });
    }

    const imagePath = deletedBlog.image;
    // Delete the image file
    fs.unlink(`uploads\\blogsImg\\${imagePath}`, (error) => {
      if (error) {
        console.error(`Error deleting image: ${error.message}`);
      } else {
        console.log(`image ${imagePath} deleted successfully`);
      }
    });

    return response.status(StatusCodes.OK)
      .json({
        message: 'Blog deleted successfully'
      });
  } catch (error) {
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
      });
  }
};