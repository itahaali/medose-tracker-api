import mongoose from "mongoose";

const doseSchema = new mongoose.Schema({
  medicine: { type: mongoose.SchemaTypes.ObjectId, ref: "Medicine" },
  user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  takenAt: { type: Date, required: true },
  status: { type: [String], enum: ["missed", "taken"], default: ["taken"] },
  missedNote: String
}, { timestamps: true });

export default mongoose.model("Dose", doseSchema);