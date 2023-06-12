import {Request, Response, NextFunction, ErrorRequestHandler} from "express";
import jsonwebtoken from "jsonwebtoken";
import {TokenPayload} from "../index";
import UserModel, {Role} from "../Model/User";


export default function (role?: Role) {
    // Inner function must call "next" ☹️
    //  i was expecting it to be automatic like how it is when it's the root
    return async function (req: Request, res: Response, next: NextFunction) {
        const auth_header = req.header("Authorization")

        // 1. The auth token is here?
        if (!auth_header) {
            return res.sendStatus(401);
        }

        // 2. I'm not sure if I should perform this check 🤔
        if (!auth_header.startsWith("Bearer")) {
            return res.status(400).json({
                message: "expecting a bearer token"
            })
        }

        // 3. User may try to be funny by sending a take token
        const payload = jsonwebtoken.decode(auth_header.substring(7), {json: true}) as TokenPayload

        if (!payload) {
            return res
                .status(400)
                .json({
                    message: "Token is invalid"
                })
        }

        // 4. Check if user role is valid for this resource
        if (role) {
            const user = await UserModel.findById(payload.userId, {role: 1})

            if (user!.role !== role) {
                return res
                    .status(401)
                    .json({
                        message: "You do not have authorization to access this resource"
                    })
            }
        }

        // Success 😀
        req.authUser = {id: payload.userId}
        next()
    }
}