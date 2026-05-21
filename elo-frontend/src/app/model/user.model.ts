import { UserRole } from "./Enums";

export interface User {
    id: string,
    email: string,
    role: UserRole
}