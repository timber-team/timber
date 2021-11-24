import {doRequest} from '.';
import {Tag} from './types';

export const getAllTags = async (accessToken: string): Promise<Tag[]> => {
  const {data, error} = await doRequest<Tag[]>({
    url: '/tags',
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
