import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import authRouter from "./routes/auth.js"; 
import verifyToken from "./middleware/auth.js";

import medRouter from "./routes/api/medicine.js";
import doseRouter from "./routes/api/dose.js";

connectDB();
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRouter);
app.use(verifyToken);
app.use("/api/medicine", medRouter);
app.use("/api/dose", doseRouter);

mongoose.connection.once("open", () => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on PORT ${process.env.PORT}`)
  })
});