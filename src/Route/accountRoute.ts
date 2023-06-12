import express, {Request, Response} from "express";
import AuthMiddleware from "../Middlewares/AuthMiddleware";
import UserModel from "../Model/User";

const route = express.Router();

route.get("/info", AuthMiddleware(), async (req: Request, res: Response) => {

    const user = await UserModel.findById(
        req.authUser.id,
        {_id: -1}
    ).lean();

    return res.json(user)
})

export default route;
