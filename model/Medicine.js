import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true, lowercase: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  timesPerDay: { type: Number, required: true },
  startDate: { type: Date, required: true },
  user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Medicine", medicineSchema);