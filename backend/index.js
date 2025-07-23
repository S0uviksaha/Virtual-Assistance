import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api", authRouter);

app.listen(port, ()=> {
    connectDB();
    console.log("Server is running on port ",port);
});