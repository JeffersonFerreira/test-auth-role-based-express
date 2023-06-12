import * as mongoose from "mongoose"

export type Role = "admin" | "user" | "org"

export interface UserType {
    email: string,
    password: string,
    role: Role
}

const account_schema = new mongoose.Schema<UserType>({
    email: String,
    password: String,
    role: {
        type: String,
        enum: ["admin" , "user" , "org"] as Role[],
        default: "user"
    }
})

const UserModel = mongoose.model<UserType>("user", account_schema);

export default UserModel;