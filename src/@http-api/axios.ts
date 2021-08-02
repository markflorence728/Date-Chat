import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from "../config/config";

const headers = {
  'Content-Type': 'application/json',
};

const axiosInstance = axios.create({
  baseURL: config.API_BASE_URL,
  headers
});

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('privatedate.id_token');
    if (token) {
      config.headers['Authorization'] = token;
    } else {
      delete config.headers['Authorization'];
    }

    return config;
  },
  (error: AxiosError) => {
    // handle the error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // response handler
    return response;
  },
  (error: AxiosError) => {
    // error handler
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('privatedate.id_token');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
