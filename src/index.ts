import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose";
import bodyParser from "body-parser";

import AuthRoute from "./Route/authRoute";
import SecretRoute from "./Route/secretRoute";
import AccountRoute from "./Route/accountRoute"

dotenv.config();

const app = express()

app.use(bodyParser.json())

app.use("/auth", AuthRoute)
app.use("/private", SecretRoute)
app.use("/account", AccountRoute)

app.get("/", async (req, res) => {
    return res.json({
        message: "Hello world"
    });
})

mongoose.connect(process.env.DATABASE_CONNECTION!)
app.listen(3000, () => console.log(`Hosting at port ${3000}`));

export interface TokenPayload {
    userId: string,
}
