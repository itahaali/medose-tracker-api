import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Database connection established");
  } catch (error) {
    console.error("Database connection failed", error);
  }
}

export default connectDB;