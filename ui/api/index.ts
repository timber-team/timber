import Axios, {AxiosRequestConfig} from 'axios';

import {GenericResponse} from './types';

const axios = Axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const doRequest = async <T>(reqOptions: AxiosRequestConfig) => {
  let res: GenericResponse<T> | undefined;
  let data: T | undefined;
  let error: Error | undefined;

  reqOptions.url = `/api${reqOptions.url}`;

  try {
    const response = await axios.request<GenericResponse<T>>(reqOptions);
    res = response.data;
    if (res.detail === 'error') {
      error = new Error(res.msg);
    } else {
      data = res.data;
    }
  } catch (e) {
    if (e.response) {
      error = e.response;
    } else if (e.request) {
      error = e.request;
    } else {
      error = e;
    }
  }

  return {
    data,
    error,
  };
};
