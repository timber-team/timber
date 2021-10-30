import {  get_attached_user } from "./application";

import {Application, Project, User} from "./models";

const DB_NAME  = "temp_proj"

interface TEMP_DB {
    data: Map<string, Project>
}


export const get_applicants = async (project: Project): Promise<Array<[Application, User]>> => {
    let out_list: Array<[Application, User]> = [];
    for (let application of project.Applications) {
        let user = await get_attached_user(application);
        out_list.push([application, user]);
    }

    return out_list
}

export const get_project = async (proj_id: string): Promise<Project> => {
    let thing = get_sample_project(proj_id);
    if (thing != undefined) {
        return thing
    }

    let user_json_db: TEMP_DB = JSON.parse(localStorage.getItem(DB_NAME));
    let data = user_json_db.data;

    let thing_2 = data.get(proj_id)

    if (thing_2 === undefined){
        throw "no project"
    }

    return thing_2
}


export const create_project = async (proj_name: string): Promise<Project> => {

    let user_json_db: TEMP_DB = JSON.parse(localStorage.getItem(DB_NAME));
    let data = user_json_db.data;

    let biggest_id = Math.max(...[...data.keys()].map(x => parseInt(x)).concat([2]));

    let proj_id = String(biggest_id + 1)

    let sample_proj = {
        ID: proj_id,
        CreatedAt: String(Date.now()),
        UpdatedAt: String(Date.now()),
        Name: proj_name,
        Description: "yes",
        OwnerID: "",
        Collaborators: [],
        PreferredSkills: [],
        RequiredSkills: [],
        Applications: []
        
    }



    // let user_json_db: USER_TEMP_DB = JSON.parse(localStorage.getItem("temp_users"));
    // let data = user_json_db.data;

    let result = data.set(proj_id, sample_proj);

    localStorage.setItem(DB_NAME, JSON.stringify(data));

    return sample_proj
}


export const edit_user = async (mods: Project): Promise<Project> => {
    let user_json_db: TEMP_DB = JSON.parse(localStorage.getItem(DB_NAME));
    let data = user_json_db.data;

    if (data.get(mods.ID) === undefined){
        throw "project doesnt exist"
    }

    data.set(mods.ID, mods);

    localStorage.setItem(DB_NAME, JSON.stringify(data));

    return mods

}

export const delete_user = async (proj_id: string): Promise<boolean> => {

    let user_json_db: TEMP_DB = JSON.parse(localStorage.getItem(DB_NAME));
    let data = user_json_db.data;

    let result = data.delete(proj_id);

    localStorage.setItem(DB_NAME, JSON.stringify(data));

    return result


    // simple_api_request("/users/" + user_id, "DELETE", null);
    // return true
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



