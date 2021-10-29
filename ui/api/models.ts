

export interface Application{
    ID: string,
    CreatedAt: string,
    UpdatedAt: string,
    UserID: string,
    ProjectID: string,
    Timestamp: string,
}


export interface User{
    ID: string,
    CreatedAt: string,
    UpdatedAt: string,
    Username: string,
    Description: string,
    AvatarURL: string,
    Tags: string[],
    Projects:Project[],
    Applications: Application[]

    

}

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