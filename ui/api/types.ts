/* eslint-disable camelcase */

export interface User {
  id: number;
  created_at: number;
  modified_at: number;
  username: string;
  email: string;
  verified: boolean;
  description: string;
  avatar_url: string;
  tags?: Tag[];
  projects?: Project[];
  applications?: Application[];
}

export interface Project {
  id: number;
  created_at: number;
  modified_at: number;
  name: string;
  description: string;
  image_url: string;
  owner_id: number;
  owner: User;
  collaborators?: User[];
  preferred_skills: Tag[];
  required_skills: Tag[];
  applications?: Application[];
  // Virtual fields
  user_applied?: boolean;
}

export interface Application {
  id: number;
  created_at: number;
  modified_at: number;
  user_id: number;
  project_id: number;
  accepted: boolean;
  denied: boolean;
}

export interface Tag {
  id: number;
  name: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface GenericResponse {
  detail: string;
  msg: string;
  data: any;
  code: number;
}
