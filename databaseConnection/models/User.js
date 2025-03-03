import mongoose, { Schema } from "mongoose";

// Schema for a user
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });// Automatically adds a time 'createdAt' and 'updatedAt' fields

// Check if the user model already exists if not create it
export const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;