import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, minlength: 8, required: true },
  roles: { type: [String], enum: ["patient", "viewer"], default: ["patient"] },
  refreshToken: String,
  contact: String,
}, { timestamps: true });

export default mongoose.model("User", userSchema);