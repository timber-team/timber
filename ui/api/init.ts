import axios, { AxiosRequestConfig } from "axios";
import { GenericResponse } from "./types";

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
  if (access_token === null) {
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
    baseURL: 'http://localhost',
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

  return [
    resp,
    error,
  ];
};
