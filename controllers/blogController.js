import { getReasonPhrase, StatusCodes } from "http-status-codes";
import Blog from "../databaseConnection/models/BlogModel.js";
import fs from 'fs';
import path from "path";
import mongoose from "mongoose";

/* code to fetch all blogs starts from here */
export const getAllBlogs = async (request, response) => {
  try {
    const blogs = await Blog.find();
    response.status(StatusCodes.OK).send({blogs});
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  }
}
/* code to fetch all blogs ends here */

/* code to fetch blogs by user_ID starts from here*/
export const getBlogsByUser = async (request, response) => {
  // const { user_ID } = request.params;
  const user_ID = request.userId;
  try {
    const blogs = await Blog.find({ user_ID });
    // console.log(blogs[0]);
    if (blogs.length === 0) {
      return response.status(StatusCodes.NOT_FOUND)
        .send({ message: 'You have created 0 blogs' });
    }
    response.status(StatusCodes.OK).send({ blogs });
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({
        message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
      })
  }
};
/* code to fetch blogs by user_ID ends here */

/* code to get blog data by blogId starts from here */
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

    response.status(StatusCodes.OK).send({blog});
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  } 
}
/* code to get blog data by blogId ends here */


/* code to add a new blog starts from here */
export const addBlog = async (request, response) => {
  try {
    const {
      // user_ID,
      title,
      description,
      category,
      author,
    } = request.body;

    const image = request.file ? path.basename(request.file.path) : ''; // Extract only the file name

    // const image = request.file ? request.file.path.replace(/\\/g, '/') : '';

    // const image = request.file ? request.file.path : '';
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
    // console.log(blog);
    response.status(StatusCodes.CREATED).send({
      blog: blog,
      message: "blog created successfully"
    });
  } catch (error) {
    console.log(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  }
}
/* code to add a new blog ends here */

/* code to edit blog by ID and delete the old image if a new one is uploaded starts from here */
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

    //Checking if the loggedin user is same the owner of the blog
    if (existingBlog.user_ID.toString() !== userId) {
      return response
        .status(StatusCodes.FORBIDDEN)
        .send({ message: "You are not authorized to edit this blog" });
    }


    if (request.file) {
      const oldImagePath = existingBlog.image;//old image path

      updatedBlog.image = path.basename(request.file.path);//request.file.path;// set the new image path in the updatedBlog object

      // Delete the old image file
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
    response.status(StatusCodes.OK).send({
      blog,
      message:"Your blog has been successfully updated!",
    });
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  }
}
/* code to edit blog by ID and delete the old image if a new one is uploaded ends here */

/* code to delete blog by ID and delete the image starts from here */
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

    response.status(StatusCodes.OK)
      .json({
        message: 'Blog deleted successfully'
      });
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
      });
  }
};
/* code to delete blog by ID and delete the image ends here */


/*user_ID
 title
description
category
author
image
date */