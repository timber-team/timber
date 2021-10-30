import {user} from "./init";
import { get_user} from "./user";

import {Application, Project, User} from "./models";

const DB_NAME = "temp_applications"

interface TEMP_DB {
    data: Map<string, Application>
}


export const get_attached_user = async (application: Application): Promise<User> =>{
    return get_user(application.UserID)
}


export const get_application = async (app_id: string): Promise<Application> => {
    let thing = get_sample_application(app_id);
    if (thing != undefined) {
        return thing
    }

    let user_json_db: TEMP_DB = JSON.parse(localStorage.getItem(DB_NAME));
    let data = user_json_db.data;

    let thing_2 = data.get(app_id)

    if (thing_2 === undefined){
        throw "no application"
    }

    return thing_2
}

export const create_application = async (project_id: string, user_id: string): Promise<Application> => {

    let user_json_db: TEMP_DB = JSON.parse(localStorage.getItem(DB_NAME));
    let data = user_json_db.data;

    let biggest_id = Math.max(...[...data.keys()].map(x => parseInt(x)).concat([2]));

    let application_id = String(biggest_id + 1)

    let sample_application = {
        ID: application_id,
        CreatedAt: String(Date.now()),
        UpdatedAt: String(Date.now()),
        UserID: user_id,
        ProjectID: project_id
        
    }



    // let user_json_db: USER_TEMP_DB = JSON.parse(localStorage.getItem("temp_users"));
    // let data = user_json_db.data;

    let result = data.set(user_id, sample_application);

    localStorage.setItem(DB_NAME, JSON.stringify(data));

    return sample_application
}


// dont try deleting either of sample ones please :(
    export const delete_application = async (app_id: string): Promise<boolean> => {

        let user_json_db: TEMP_DB = JSON.parse(localStorage.getItem(DB_NAME));
        let data = user_json_db.data;
    
        let result = data.delete(app_id);
    
        localStorage.setItem(DB_NAME, JSON.stringify(data));
    
        return result
    
    
        // simple_api_request("/users/" + user_id, "DELETE", null);
        // return true
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