import { doRequest, NoData } from ".";
import { TokenResponse } from "./types";

export const GetAccessToken = async <T>(query: string, provider: string) => {
  const [response, err] = await doRequest({
    url: `/api/auth/callback/${provider}${query}`,
    method: "GET",
  });
  if (err !== null) {
    console.log(err);
    return err;
  }

  if (response === null) {
    return NoData;
  }

  const token_pair = response.data as TokenResponse;
  await localStorage.setItem("access_token", token_pair.access_token);
  await localStorage.setItem("refresh_token", token_pair.refresh_token);

  return true;
};

export const RefreshTokens = async <T>() => {
  const [response, err] = await doRequest({
    url: `/api/auth/tokens`,
    method: "POST",
    data: {
      refreshToken: localStorage.getItem("refresh_token"),
    },
  });
  if (err !== null) {
    console.log(err);
    return err;
  }

  if (response === null) {
    return NoData;
  }

  const token_pair = response.data as TokenResponse;
  console.log(token_pair);
  await localStorage.setItem("access_token", token_pair.access_token);
  await localStorage.setItem("refresh_token", token_pair.refresh_token);

  return true;
};
