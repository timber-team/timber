import {user} from "./init";
import { get_user, User } from "./user";

export interface Application{
    ID: string,
    CreatedAt: string,
    UpdatedAt: string,
    UserID: string,
    ProjectID: string,
    Timestamp: string,
}


export function get_attached_user(application: Application): User{
    return get_user(application.UserID)
}