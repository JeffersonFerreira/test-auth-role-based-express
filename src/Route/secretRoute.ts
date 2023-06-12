import express, {Request, Response} from "express";
import AuthMiddleware from "../Middlewares/AuthMiddleware";

const route = express.Router();

route.get("/", AuthMiddleware("user"), (req: Request, res: Response) => {
    res.json({
        message: `Hello user ${req.authUser.id}`
    })
})

export default route;