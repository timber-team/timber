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
  owner_id: number;
  collaborators?: User[];
  preferred_skills: Tag[];
  required_skills: Tag[];
  applications?: Application[];
}

export interface Application {
  id: number;
  created_at: number;
  modified_at: number;
  user_id: number;
  project_id: number;
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
  detail: "success" | "changed" | "error" | "authorization";
  msg: string;
  data?: any;
  code: number;
}
