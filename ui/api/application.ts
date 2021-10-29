import {user} from "./init";
import { get_user} from "./user";

import {Application, Project, User} from "./models";


export function get_attached_user(application: Application): User{
    return get_user(application.UserID)
}