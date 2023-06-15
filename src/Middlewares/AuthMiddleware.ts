import {Request, Response, NextFunction, ErrorRequestHandler} from "express";
import jsonwebtoken from "jsonwebtoken";
import {TokenPayload} from "../index";
import UserModel, {Role} from "../Model/User";

export default function (role?: Role) {
    // Inner function must call "next" ☹️
    //  i was expecting it to be automatic like when it's the root
    return async function (req: Request, res: Response, next: NextFunction) {
        const authHeader = req.header("Authorization")

        // 1. The auth token is here?
        if (!authHeader) {
            return res.sendStatus(401);
        }

        // 2. The token type is correct?
        if (!authHeader.startsWith("Bearer")) {
            return res.status(400).json({
                message: "expecting a bearer token"
            })
        }

        // 3. Let's try to decode this token now
        const payload = jsonwebtoken.decode(authHeader.substring(7), {json: true}) as TokenPayload
        if (!payload) {
            return res
                .status(400)
                .json({
                    message: "Token is invalid"
                })
        }

        // 4. If the route is constrained for a single role, check if the user has it.
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

        // Success 😀 🎉
        req.authUser = {
            id: payload.userId
        }
        next()
    }
}