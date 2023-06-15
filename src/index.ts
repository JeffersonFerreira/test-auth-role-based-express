import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose";
import app from "./app";

dotenv.config();

mongoose.connect(process.env.DATABASE_CONNECTION!)

const expressService = express()

expressService.use(app);
expressService.listen(3000, () => console.log(`Hosting at port ${3000}`));

export interface TokenPayload {
    userId: string,
}
