/* eslint-disable camelcase */
import {User} from 'api/types';
import jwt_decode from 'jwt-decode';

// storeTokens Utility function for storing accessToken and refreshToken
export const storeTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

export const deleteTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

interface TokenClaims {
  exp: number;
  iat: number;
}

export interface AccessTokenClaims extends TokenClaims {
  user: User;
}

export interface RefreshTokenClaims extends TokenClaims {
  uid: string;
  jti: string;
}

// getTokenPayload Gets the token's payload/claims, returns null if invalid
export const getTokenPayload = <T extends TokenClaims>(
  token: string | undefined,
) => {
  if (!token) {
    return undefined;
  }

  const tokenClaims = jwt_decode<T>(token);

  if (Date.now() / 1000 >= tokenClaims.exp) {
    return undefined;
  }

  return tokenClaims;
};
