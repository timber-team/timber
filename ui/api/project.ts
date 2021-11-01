import { APIResponse, simple_api_request, user, application} from "./init";

export interface Project{
    ID: string,
    CreatedAt: string,
    UpdatedAt: string,
    Name: string,
    Description: string,
    OwnerID: string,
    Collaborators: [user.User],
    PreferredSkills: [string],
    RequiredSkills: [string],
    Applications: [application.Application]
}