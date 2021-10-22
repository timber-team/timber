import {APIResponse, simple_api_request} from "./init"

export function get_user(user_id: string): APIResponse{
    return simple_api_request("/users/" + user_id,"GET", null, false)
}


// export function get_self(): APIResponse{
//     return simple_api_request()
// }

export function make_user(email_address: string, username: string): APIResponse{

    let user_details = {
        email_address: email_address,
        username: username
    }

    return simple_api_request("/users/", "POST", user_details, false)
}


// export function edit_user(): APIResponse{

// }

export function delete_user(user_id: string): APIResponse{
    return simple_api_request("/users/" + user_id, "DELETE", null)
}
