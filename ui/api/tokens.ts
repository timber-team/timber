import {doRequest} from '.';
import {storeTokens} from '../utils';
import {TokenResponse} from './types';

export const getAccessToken = async (query: string, provider: string) => {
  const {data, error} = await doRequest<TokenResponse>({
    url: `/auth/callback/${provider}${query}`,
    method: 'GET',
  });

  console.log('getAccessToken', data, error);

  if (error) {
    return error;
  }

  if (!data) {
    return new Error('No data returned from server');
  }

  const tokenPair = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  };

  storeTokens(tokenPair.access_token, tokenPair.refresh_token);

  return true;
};

export const refreshTokens = async () => {
  const {data, error} = await doRequest<TokenResponse>({
    url: '/auth/tokens',
    method: 'POST',
    data: {
      refreshToken: localStorage.getItem('refresh_token'),
    },
  });

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('No data returned');
  }

  const tokenPair = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  };

  storeTokens(tokenPair.access_token, tokenPair.refresh_token);

  return true;
};
