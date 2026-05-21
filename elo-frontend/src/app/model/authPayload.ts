import { User } from "./user.model";

export interface AuthPayload {
    token: string,
    user: User
}