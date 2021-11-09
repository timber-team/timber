/* eslint-disable max-len */
// import create, {SetState} from 'zustand';
import create, {SetState} from 'zustand';

import {doRequest} from '../api';
import {TokenResponse, User} from '../api/types';
import {
  AccessTokenClaims,
  getTokenPayload,
  RefreshTokenClaims,
  storeTokens,
} from '../utils';

type AuthState = {
  currentUser: User | undefined;
  accessToken: string | undefined;
  isLoading: boolean;
  error: Error | undefined;
  getUser: (forceRefresh: boolean) => Promise<User | undefined>;
};

export const useAuth = create<AuthState>((set) => ({
  currentUser: undefined,
  accessToken: undefined,
  isLoading: false,
  error: undefined,
  getUser: (forceRefresh = false) => getUser({set, forceRefresh}),
}));

const getUser = async (options: {
  set: SetState<AuthState>;
  forceRefresh: boolean;
}) => {
  const {set, forceRefresh} = options;
  set((state) => ({...state, isLoading: true, error: undefined}));

  const accessToken = localStorage.getItem('access_token') ?? undefined;
  const accessTokenClaims = getTokenPayload<AccessTokenClaims>(accessToken);

  if (accessTokenClaims && !forceRefresh) {
    set((state) => ({
      ...state,
      currentUser: accessTokenClaims.user,
      accessToken,
      isLoading: false,
    }));
    return accessTokenClaims.user;
  }

  const refreshToken = localStorage.getItem('refresh_token') ?? undefined;
  const refreshTokenClaims = getTokenPayload<RefreshTokenClaims>(refreshToken);

  if (!refreshTokenClaims) {
    set((state) => ({
      ...state,
      isLoading: false,
      currentUser: undefined,
      accessToken: undefined,
    }));
    return undefined;
  }

  const [data, error] = await doRequest({
    url: '/auth/tokens',
    method: 'POST',
    data: {
      refreshToken,
    },
  });

  if (error) {
    set((state) => ({
      ...state,
      isLoading: false,
      currentUser: undefined,
      accessToken: undefined,
      error,
    }));
    return undefined;
  }

  if (!data) {
    set((state) => ({
      ...state,
      isLoading: false,
      currentUser: undefined,
      accessToken: undefined,
      error: new Error('No data returned'),
    }));
    return undefined;
  }

  const tokenPair = data.data as TokenResponse;

  storeTokens(tokenPair.access_token, tokenPair.refresh_token);
  const tokenClaims = getTokenPayload<AccessTokenClaims>(
      tokenPair.access_token,
  );
  set((state) => ({
    ...state,
    isLoading: false,
    currentUser: tokenClaims!.user,
    accessToken: tokenPair.access_token,
    error: undefined,
  }));
  return tokenClaims!.user;
};
