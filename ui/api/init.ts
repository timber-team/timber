import axios, { AxiosRequestConfig } from "axios";
import { GenericResponse } from "./types";
import * as tokens from './tokens'

export * as tokens from './tokens'
export * as users from './users'
export * as projects from './projects'

export const NoData = new Error("no data")

export const doRequest = async (
  path: string, method: "GET" | "POST" | "PATCH" | "DELETE", body: any):
  Promise<[GenericResponse, Error | null]> => {

  const noResp: GenericResponse = {
    code: 0,
    detail: "error",
    msg: "",
    data: null,
  }

  const access_token = await localStorage.getItem("access_token")
  // cause loginDialog to come up
  if (access_token === null && !path.includes("/auth/callback/")) {
    const err = new Error("Invalid token")
    const noResp: GenericResponse = {
      code: 0,
      detail: "error",
      msg: "",
      data: null,
    }
    return [noResp, err]
  }

  const reqOptions: AxiosRequestConfig = {
    method: method,
    url: path,
    baseURL: 'http://localhost/api',
    headers: {"Authorization": `Bearer ${access_token}`},
    data: (method === "GET") ? null:body, // dont try to send a json body if GET
  }

  let error: Error | null;
  let resp: GenericResponse;

  try {
    const response = await axios.request(reqOptions);
    resp = response.data as GenericResponse;
    error = null
  } catch (e: any) {
    if (e.response) {
      error = e.response;
    } else if (e.request) {
      error = e.request;
    } else {
      error = e;
    }
    resp = noResp
  }

  // development testing
  console.log({resp, error})

  if (resp.detail === "authorization") {
    if (localStorage.getItem("refresh_token") !== null) {
      if ( (await tokens.RefreshTokens()) instanceof Error) {
        return [resp, error]
      } else {
        return doRequest(path, method, body)
      }
    }
    return [resp, error]
  }

  return [
    resp,
    error,
  ];
};
