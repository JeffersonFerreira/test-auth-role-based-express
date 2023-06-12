import express from "express";
import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken"
import UserModel from "../Model/User";

const router = express.Router();

router.post("/register", async (req, res) => {
    const {email, password} = req.body;
    const hashed = await bcrypt.hash(password, 10);

    const account = await UserModel
        .create({
            email,
            password: hashed
        })

    const token = jsonwebtoken.sign(
        {userId: account._id},
        process.env.JWT_PRIVATE_KEY!
    )

    return res
        .status(201)
        .json({token})
})

router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    const account = await UserModel.findOne({email: email}).lean();

    if (!account) {
        return res.status(401).json({message: "This account does not exists"});
    }

    // The operation order here matters, you must pass the plain password first
    const valid_password = await bcrypt.compare(password, account.password);

    if (!valid_password) {
        return res.status(401).json({message: "Invalid credentials"});
    }

    const token = jsonwebtoken.sign(
        {userId: account._id},
        process.env.JWT_PRIVATE_KEY!
    )

    return res
        .status(201)
        .json({token})
})

export default router