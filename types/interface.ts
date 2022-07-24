import { UserType } from "./enums";

export interface IUserObj {
    user_id: string;
    userType: UserType;
    createdAt: number;
    isActive: boolean;
    username: string;
    password: string
}
