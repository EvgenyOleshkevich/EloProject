import { UserRole } from "../Enums"

export interface RegisterInput {
    email: string,
    password: string
    role: UserRole
}