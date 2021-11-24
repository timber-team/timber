import {doRequest} from '.';
import {Project} from './types';

export const getRecommendedProjects = async (
    accessToken: string,
): Promise<Project[]> => {
  const {data, error} = await doRequest<Project[]>({
    url: '/projects/recommended',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error('No data returned');
  }
  return data;
};

export const getProjectsByPopularity = async (
    accessToken: string,
): Promise<Project[]> => {
  const {data, error} = await doRequest<Project[]>({
    url: '/projects/popular',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error('No data returned');
  }
  return data;
};

export const getProjectById = async (
    projectId: number,
    accessToken: string,
): Promise<Project> => {
  const {data, error} = await doRequest<Project>({
    url: `/projects/${projectId}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error('No data returned');
  }
  return data;
};

export const getProjectsByUserId = async (
    userId: number,
    accessToken: string,
): Promise<Project[]> => {
  const {data, error} = await doRequest<Project[]>({
    url: `/projects/users/${userId}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error('No data returned');
  }
  return data;
};

export const createProject = async (
    project: Partial<Project>,
    accessToken: string,
): Promise<Project> => {
  const {data, error} = await doRequest<Project>({
    url: '/projects',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: project,
  });

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('No data returned');
  }

  return data as Project;
};

export const updateProject = async (
    project: Partial<Project>,
    accessToken: string,
): Promise<Project> => {
  const {data, error} = await doRequest<Project>({
    url: `/projects/${project.id}`,
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: project,
  });

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('No data returned');
  }

  return data;
};

export const deleteProject = async (
    projectId: number,
    accessToken: string,
): Promise<void> => {
  const {error} = await doRequest<void>({
    url: `/projects/${projectId}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (error) {
    throw error;
  }
};
