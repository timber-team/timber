import {doRequest} from '.';
import {Application} from './types';

export const getOwnApplications = async (
    accessToken: string,
): Promise<Application[]> => {
  const {data, error} = await doRequest<Application[]>({
    url: '/applications',
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

export const createApplication = async (
    projectID: number,
    accessToken: string,
): Promise<Application> => {
  const {data, error} = await doRequest<Application>({
    url: `/applications/${projectID}`,
    method: 'POST',
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

export const updateApplication = async (
    application: Partial<Application>,
    accessToken: string,
): Promise<Application> => {
  const {data, error} = await doRequest<Application>({
    url: `/applications/${application.id}`,
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: application,
  });
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error('No data returned');
  }
  return data;
};

export const getApplicationsByProjectId = async (
    projectID: number,
    accessToken: string,
): Promise<Application[]> => {
  const {data, error} = await doRequest<Application[]>({
    url: `/projects/${projectID}/applications`,
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
