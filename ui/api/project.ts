import { Application, User } from "./types";

export interface Project {
  ID: string;
  CreatedAt: string;
  UpdatedAt: string;
  Name: string;
  Description: string;
  OwnerID: string;
  Collaborators: [User];
  PreferredSkills: [string];
  RequiredSkills: [string];
  Applications: [Application];
}
