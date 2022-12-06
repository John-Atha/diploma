import axios from "axios";
import { authApiUrl } from "./config";
import { buildAuthHeader, getRequest } from "./helpers";

export const checkLoggedCall = () => {
  const requestUrl = `${authApiUrl}/users/logged`;
  const headers = buildAuthHeader();
  return getRequest({ requestUrl, headers });
};

export const loginCall = (username: string, password: string) => {
  const requestUrl = `${authApiUrl}/users/login`;
  return axios.post(requestUrl, { username, password });
};

export const signupCall = (username: string, password: string) => {
  const requestUrl = `${authApiUrl}/users`;
  return axios.post(requestUrl, { username, password });
};

export const updateProfileCall = (body: any, userId: number) => {
  const requestUrl = `${authApiUrl}/users/${userId}`;
  const headers = buildAuthHeader();
  return axios.put(requestUrl, body, { headers });
};
