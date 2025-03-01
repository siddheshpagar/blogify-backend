import mongoose, { Schema } from "mongoose";

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
}, { timestamps: true });

likeSchema.index({ user_ID: 1, blog_ID: 1 }, { unique: true });

const Like = mongoose.models.like || mongoose.model('like', likeSchema);

export default Like;
