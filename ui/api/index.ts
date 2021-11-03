import axios, {AxiosRequestConfig} from 'axios';
import {GenericResponse} from './types';

/**
 * @param {AxiosRequestConfig} config
 * @returns {Promise<[GenericResponse | null, Error | null]>}
 * @async
 * @name doRequest
 * @memberof api
 * @function
 * @inner
 * @description
 * This function is used to make a request to the API.
 * It returns a promise with the response or an error.
 * @example
 * ```js
 * const response = await doRequest(config);
 * ```
 */

export const doRequest = async (
    config: AxiosRequestConfig,
): Promise<[GenericResponse | null, Error | null]> => {
  try {
    const response = await axios(config);
    return [response.data, null];
  } catch (error) {
    return [null, error];
  }
};

export * as projects from './project';
export * as tokens from './tokens';
export * as types from './types';
export * as users from './user';

export const NoData = new Error('no data');
