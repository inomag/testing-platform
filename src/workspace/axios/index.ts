import axios from 'axios';
import { isSelfServe } from '../utils';

// import type { AxiosResponse } from 'axios';

const axiosInstance = axios.create();

const handleError = (error) => Promise.reject(error);

let authToken = '';

export const setAxiosInstanceAuthToken = (auth_token: string) => {
  authToken = auth_token;
};

const requestInterceptor = (config) => {
  if (authToken) {
    config.headers['X-vymo-auth-token'] = authToken;
  }
  if (isSelfServe()) {
    config.headers['Ss-ui'] = true;
  }
  return config;
};

const responseInterceptor = (response) => {
  if ('statusText' in response) {
    if (response.status === 200 || response.statusText === 'OK') {
      return {
        data: response.data,
        headers: response.headers,
        status: response.status,
      };
    }
    return Promise.reject(response);
  }
  return response;
};

axiosInstance.interceptors.request.use(requestInterceptor, handleError);

axiosInstance.interceptors.response.use(responseInterceptor, handleError);

// @ts-ignore
export default axiosInstance;

export type AxiosResponseV1 = any;
