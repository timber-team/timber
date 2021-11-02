import create, { SetState } from "zustand";

import { doRequest } from "../api/init";
import { TokenResponse, User } from "../api/types";
import {
  AccessTokenClaims,
  getTokenPayload,
  RefreshTokenClaims,
  storeTokens,
} from "../utils";

type AuthState = {
  currentUser?: User;
  accessToken?: string;
  isLoading: boolean;
  error?: Error;
  getUser: (forceRefresh: boolean) => Promise<void>;
};

export const useAuth = create<AuthState>((set) => {
  return {
    currentUser: undefined,
    accessToken: "",
    isLoading: false,
    error: undefined,
    getUser: (forceRefresh: boolean = false) => getUser({ set, forceRefresh }),
  };
});

const getUser = async (options: {
  set: SetState<AuthState>;
  forceRefresh: boolean;
}) => {
  const { set, forceRefresh } = options;
  set({ isLoading: true, error: undefined });

  const accessToken = localStorage.getItem("access_token") ?? undefined;
  const accessTokenClaims = getTokenPayload<AccessTokenClaims>(accessToken);

  if (accessTokenClaims && !forceRefresh) {
    set({
      accessToken: accessToken,
      currentUser: accessTokenClaims.user,
      isLoading: false,
    });
    console.log(accessTokenClaims.user);
    return;
  }

  const refreshToken = localStorage.getItem("refresh_token") ?? undefined;
  const refreshTokenClaims = getTokenPayload<RefreshTokenClaims>(refreshToken);

  if (!refreshTokenClaims) {
    set({ currentUser: undefined, accessToken: undefined, isLoading: false });
    return;
  }

  const [data, error] = await doRequest({
    url: "/api/auth/tokens",
    method: "post",
    data: {
      refreshToken,
    },
  });

  if (error || !data) {
    set({
      currentUser: undefined,
      accessToken: undefined,
      error: error || Error("Could not fetch tokens"),
      isLoading: false,
    });
    return;
  }

  const token_pair = data.data as TokenResponse;
  storeTokens(token_pair.access_token, token_pair.refresh_token);
  const tokenClaims = getTokenPayload<AccessTokenClaims>(
    token_pair.access_token
  );
  set({
    accessToken: token_pair.access_token,
    currentUser: tokenClaims!.user,
    isLoading: false,
  });
};
