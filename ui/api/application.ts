import {user} from "./init";
import { get_user} from "./user";

import {Application, Project, User} from "./models";


export function get_attached_user(application: Application): User{
    return get_user(application.UserID)
}


export function get_applicaion(app_id: string): Application{
    return get_sample_application(app_id);
}




let sample_applications = {"1": {
        ID: "1",
        CreatedAt: "2000",
        UpdatedAt: "3000",
        UserID: "2",
        ProjectID: "1",
},
    "2": {
        ID: "2",
        CreatedAt: "5000",
        UpdatedAt: "6000",
        UserID: "1",
        ProjectID: "2"
    }}

function get_sample_application(app_id: string): Application{
    return sample_applications[app_id]
}