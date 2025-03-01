import mongoose, { Schema } from "mongoose";

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
}, { timestamps: true });

export const Admin = mongoose.models.admin || mongoose.model("admin", adminSchema);
export default Admin;