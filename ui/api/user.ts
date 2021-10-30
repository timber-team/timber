import {APIResponse, project, simple_api_request, application} from "./init"

import {Application, Project, User} from "./models";

// export function get_many_users(users_id_list : Array<string>){
//     typeof
// }
interface TEMP_DB {
    data: Map<string, User>
}

const DB_NAME  = "temp_users"

export const get_user = async (user_id: string): Promise<User> => {
    let thing = get_sample_user(user_id);
    if (thing != undefined) {
        return thing
    }

    let user_json_db: TEMP_DB = JSON.parse(localStorage.getItem(DB_NAME));
    let data = user_json_db.data;

    let thing_2 = data.get(user_id)

    if (thing_2 === undefined){
        throw "no user"
    }

    return thing_2
}




export const create_user = async (username: string): Promise<User> => {

    let user_json_db: TEMP_DB = JSON.parse(localStorage.getItem(DB_NAME));
    let data = user_json_db.data;

    let biggest_id = Math.max(...[...data.keys()].map(x => parseInt(x)).concat([2]));

    let user_id = String(biggest_id + 1)

    let sample_user = {
        ID: user_id,
        CreatedAt: String(Date.now()),
        UpdatedAt: String(Date.now()),
        Username: username,
        Description: "yes",
        AvatarURL: "yes",
        Tags: [],
        Projects: [],
        Applications: []
        
    }



    // let user_json_db: USER_TEMP_DB = JSON.parse(localStorage.getItem("temp_users"));
    // let data = user_json_db.data;

    let result = data.set(user_id, sample_user);

    localStorage.setItem(DB_NAME, JSON.stringify(data));

    return sample_user
}


export const edit_user = async (mods: User): Promise<User> => {
    let user_json_db: TEMP_DB = JSON.parse(localStorage.getItem(DB_NAME));
    let data = user_json_db.data;

    if (data.get(mods.ID) === undefined){
        throw "user doesnt exist"
    }

    data.set(mods.ID, mods);

    localStorage.setItem(DB_NAME, JSON.stringify(data));

    return mods

}

// dont try deleting either of sample ones please :(
export const delete_user = async (user_id: string): Promise<boolean> => {

    let user_json_db: TEMP_DB = JSON.parse(localStorage.getItem(DB_NAME));
    let data = user_json_db.data;

    let result = data.delete(user_id);

    localStorage.setItem(DB_NAME, JSON.stringify(data));

    return result


    // simple_api_request("/users/" + user_id, "DELETE", null);
    // return true
}

let sample_user_data = {"1":
    {
        ID: "1",
        CreatedAt: "500",
        UpdatedAt: "600",
        Username: "Shang",
        Description: "Betrayer of Gust overlords",
        AvatarURL: "null",
        Tags: [],
        Projects: [],
        Applications: []
        
    },
    "2":{
        ID: "2",
        CreatedAt: "900",
        UpdatedAt: "1000",
        Username: "Thomas",
        Description: "Beloved amongst men(the gender)",
        AvatarURL: "null",
        Tags: [],
        Projects: [],
        Applications: []
    }

}

function get_sample_user(user_id: string): User{
    return sample_user_data[user_id];
}