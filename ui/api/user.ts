import {APIResponse, project, simple_api_request, application} from "./init"

import {Application, Project, User} from "./models";

// export function get_many_users(users_id_list : Array<string>){
//     typeof
// }


export function get_user(user_id: string): User{


    return {
        ID: "5",
        CreatedAt: "65",
        UpdatedAt: "65",
        Username: "yes",
        Description: "yes",
        AvatarURL: "yes",
        Tags: ["yes"],
        Projects: [],
        Applications: []
    }
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
