import {doRequest, NoData} from '.';
import {storeTokens} from '../utils';
import {TokenResponse} from './types';

export const getAccessToken = async (query: string, provider: string) => {
  const [response, err] = await doRequest({
    url: `/api/auth/callback/${provider}${query}`,
    method: 'GET',
  });
  if (err !== null) {
    console.log(err);
    return err;
  }

  if (response === null) {
    return NoData;
  }

  const tokenPair = response.data as TokenResponse;

  storeTokens(tokenPair.access_token, tokenPair.refresh_token);

  return true;
};

export const refreshTokens = async () => {
  const [response, err] = await doRequest({
    url: `/api/auth/tokens`,
    method: 'POST',
    data: {
      refreshToken: localStorage.getItem('refresh_token'),
    },
  });
  if (err !== null) {
    console.log(err);
    return err;
  }

  if (response === null) {
    return NoData;
  }

  const tokenPair = response.data as TokenResponse;

  storeTokens(tokenPair.access_token, tokenPair.refresh_token);

  return true;
};
