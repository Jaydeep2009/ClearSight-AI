import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app= express();


//Middleware

app.use(cors());
app.use(express.json());

//Test route

app.get("api/health",(req,res)=>{
    res.send("Backend is running and MongoDB is connected");
});

//Auth routes
app.use("/api/auth", authRoutes);

//MongoDB connection

mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>console.log("MongoDB connected"))
    .catch((err)=>console.error("MongoDB error: ",err));

export default app;
