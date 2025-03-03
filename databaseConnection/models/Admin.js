import mongoose, { Schema } from "mongoose";

// Schema for a admin
const adminSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    }
}, { timestamps: true });// Automatically adds a time 'createdAt' and 'updatedAt' fields

// Check if the Admin model already exists if not create it
export const Admin = mongoose.models.admin || mongoose.model("admin", adminSchema);

export default Admin;