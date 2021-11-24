import {doRequest} from '.';
import {User} from './types';

export const getUserById = async (
    id: number,
    accessToken: string,
): Promise<User> => {
  const {data, error} = await doRequest<User>({
    url: `/users/${id}`,
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

export const updateUser = async (
    user: Partial<User>,
    accessToken: string,
): Promise<User> => {
  const {data, error} = await doRequest<User>({
    url: `/users`,
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: user,
  });
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error('No data returned');
  }
  return data;
};
