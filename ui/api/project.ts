import { APIResponse, simple_api_request} from "./init";
import {  get_attached_user } from "./application";

import {Application, Project, User} from "./models";



export function get_applicants(project: Project): Array<[Application, User]>{
    let out_list: Array<[Application, User]> = [];
    for (let application of project.Applications) {
        let user = get_attached_user(application);
        out_list.push([application, user])
    }

    return out_list
}

export function get_project(id: string): Project{
    return get_sample_project(id)
}


let sample_proj = {"1": {
    ID: '1',
    CreatedAt: '1412312',
    UpdatedAt: '190241024',
    Name: 'Shanghai1\'s Gust Project',
    Description: 'Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust ',
    OwnerID: '1',
    Collaborators: [],
    PreferredSkills: ['Gust', 'Ro', 'Postgres', 'Redis'],
    RequiredSkills: ['Gust', 'Ro'],
    Applications: []
},
    "2": {
        ID: '2',
        CreatedAt: '14123132',
        UpdatedAt: '1902410234',
        Name: 'Thomas\'s Go Project',
        Description: 'Golang Yum',
        OwnerID: '2',
        Collaborators: [],
        PreferredSkills: ['Go'],
        RequiredSkills: ['Go'],
        Applications: []
    }
}


function get_sample_project(id: string): Project{
    return sample_proj[id]
}



