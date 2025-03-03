import mongoose, { Schema } from "mongoose";

// Schema for a like
const likeSchema = new Schema({
    user_ID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    blog_ID: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true,
    },
}, { timestamps: true });// Automatically adds a time 'createdAt' and 'updatedAt' fields

likeSchema.index({ user_ID: 1, blog_ID: 1 }, { unique: true });

// Check if the like model already exists if not create it
const Like = mongoose.models.like || mongoose.model('like', likeSchema);

export default Like;
