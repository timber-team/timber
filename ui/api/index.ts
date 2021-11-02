import axios, { AxiosRequestConfig } from "axios";

import { GenericResponse } from "./types";

export async function doRequest(
  config: AxiosRequestConfig
): Promise<[GenericResponse | null, Error | null]> {
  try {
    const response = await axios(config);
    return [response.data, null];
  } catch (error) {
    return [null, error];
  }
}

export * as types from './types'
export * as tokens from "./tokens";
export * as users from "./users";
export * as projects from "./projects";

export const NoData = new Error("no data");
