import mongoose, { Schema } from "mongoose";

// Schema for a blog
const BlogSchema = new Schema({
    user_ID: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
}, { timestamps: true });// Automatically adds a time 'createdAt' and 'updatedAt' fields

// Check if the blog model already exists if not create it
const Blog = mongoose.models.blog || mongoose.model('blog', BlogSchema);

export default Blog;