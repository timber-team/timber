import {APIResponse, project, simple_api_request, application} from "./init"

import {Application, Project, User} from "./models";

// export function get_many_users(users_id_list : Array<string>){
//     typeof
// }


export function get_user(user_id: string): User{


    return get_sample_user(user_id);
}


// export function get_self(): APIResponse{
//     return simple_api_request()
// }

export function make_user(email_address: string, username: string): boolean{

    let user_details = {
        email_address: email_address,
        username: username
    }

    return true
}


// export function edit_user(): APIResponse{

// }

export function delete_user(user_id: string): boolean{
    simple_api_request("/users/" + user_id, "DELETE", null);
    return true
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