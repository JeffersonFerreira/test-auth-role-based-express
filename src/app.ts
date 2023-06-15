import bodyParser from "body-parser";
import AuthRoute from "./Route/authRoute";
import SecretRoute from "./Route/secretRoute";
import AccountRoute from "./Route/accountRoute";
import express from "express";

const app = express.Router();

app.use(bodyParser.json())
app.use("/auth", AuthRoute)
app.use("/private", SecretRoute)
app.use("/account", AccountRoute)

app.get("/", async (req, res) => {
    return res.json({
        message: "Hello world"
    });
})

export default app;