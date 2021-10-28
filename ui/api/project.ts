import { APIResponse, simple_api_request} from "./init";
import{User} from "./user"
import { Application, get_attached_user } from "./application";

export interface Project{
    ID: string,
    CreatedAt: string,
    UpdatedAt: string,
    Name: string,
    Description: string,
    OwnerID: string,
    Collaborators: User[],
    PreferredSkills: string[],
    RequiredSkills: string[],
    Applications: Application[]
}


export function get_applicants(project: Project): Array<[Application, User]>{
    let out_list: Array<[Application, User]> = [];
    for (let application of project.Applications) {
        let user = get_attached_user(application);
        out_list.push([application, user])
    }

    return out_list
}

export function get_project(){
    
}



