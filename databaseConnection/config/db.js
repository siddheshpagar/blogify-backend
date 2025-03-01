import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI; // Access from .env

export const ConnectDb = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("DB Connection Creaated");
  } catch (error) {
    console.log(error);
  }
}