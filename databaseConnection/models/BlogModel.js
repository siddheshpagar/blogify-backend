import mongoose, { Schema } from "mongoose";

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
}, { timestamps: true });

const Blog = mongoose.models.blog || mongoose.model('blog', BlogSchema);

export default Blog;