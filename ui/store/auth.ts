/* eslint-disable max-len */
import create, {SetState} from 'zustand';

import {doRequest} from '../api';
import {TokenResponse, User} from '../api/types';
import {
  AccessTokenClaims,
  deleteTokens,
  getTokenPayload,
  RefreshTokenClaims,
  storeTokens,
} from '../utils';

type AuthState = {
  currentUser?: User;
  accessToken?: string;
  isLoading: boolean;
  error?: Error;
  getUser: (forceRefresh?: boolean) => Promise<void>;
  logout: () => void;
};

export const useAuth = create<AuthState>((set) => {
  return {
    currentUser: undefined,
    accessToken: undefined,
    isLoading: false,
    error: undefined,
    getUser: (forceRefresh = false) => getUser({set, forceRefresh}),
    logout: () => logout(set),
  };
});

const getUser = async ({
  set,
  forceRefresh,
}: {
  set: SetState<AuthState>;
  forceRefresh: boolean;
}) => {
  set((state) => ({...state, isLoading: true, error: undefined}));

  const accessToken = localStorage.getItem('access_token') ?? undefined;
  const accessTokenClaims = getTokenPayload<AccessTokenClaims>(accessToken);

  // if (!accessToken || !accessTokenClaims) {
  //   set((state) => ({ ...state, isLoading: false, error: 'No access token' }));
  //   return;
  // }

  if (accessTokenClaims && !forceRefresh) {
    set((state) => ({
      ...state,
      isLoading: false,
      accessToken,
      currentUser: accessTokenClaims.user,
    }));
    return;
  }

  const refreshToken = localStorage.getItem('refresh_token') ?? undefined;
  const refreshTokenClaims = getTokenPayload<RefreshTokenClaims>(refreshToken);

  // if (!refreshToken || !refreshTokenClaims) {
  //   set((state) => ({ ...state, isLoading: false, error: 'No refresh token' }));
  //   return;
  // }

  if (!refreshTokenClaims) {
    set((state) => ({
      ...state,
      isLoading: false,
      accessToken: undefined,
      currentUser: undefined,
      error: Error('No refresh token'),
    }));
    return;
  }

  const {data, error} = await doRequest<TokenResponse>({
    url: '/auth/tokens',
    method: 'POST',
    data: {
      refreshToken,
    },
  });

  if (error || !data) {
    set((state) => ({
      ...state,
      isLoading: false,
      error: error || Error('Error refreshing token'),
      accessToken: undefined,
      currentUser: undefined,
    }));
    return;
  }

  const tokenPair = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  };

  storeTokens(tokenPair.access_token, tokenPair.refresh_token);
  const tokenClaims = getTokenPayload<AccessTokenClaims>(
      tokenPair.access_token,
  );
  set((state) => ({
    ...state,
    isLoading: false,
    accessToken: tokenPair.access_token,
    currentUser: tokenClaims!.user,
    error: undefined,
  }));
};

const logout = (set: SetState<AuthState>) => {
  deleteTokens();
  set((state) => ({
    ...state,
    isLoading: false,
    accessToken: undefined,
    currentUser: undefined,
    error: undefined,
  }));
};
