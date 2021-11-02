import { Application, Project } from "./types";

export interface User {
  ID: string;
  CreatedAt: string;
  UpdatedAt: string;
  Username: string;
  Description: string;
  AvatarURL: string;
  Tags: [string];
  Projects: Array<Project>;
  Applications: Array<Application>;
}

export function get_user(user_id: string): User {
  // let id = 5;

  return {
    ID: "yes",
    CreatedAt: "yes",
    UpdatedAt: "yes",
    Username: "yes",
    Description: "yes",
    AvatarURL: "yes",
    Tags: ["yes"],
    Projects: [],
    Applications: [],
  };
}

// export function get_self(): APIResponse{
//     return simple_api_request()
// }

export function make_user(email_address: string, username: string): boolean {
  let user_details = {
    email_address: email_address,
    username: username,
  };

  return true;
}

// export function edit_user(): APIResponse{

// }

// export function delete_user(user_id: string): boolean {
//   simple_api_request("/users/" + user_id, "DELETE", null);
//   return true;
// }
