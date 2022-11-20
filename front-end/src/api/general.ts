import axios from "axios";
import { apiUrl } from "./config";
import { getRequest } from "./helpers";

axios.defaults.baseURL = apiUrl;

export const getSummary = async () => {
  const requestUrl = `/summary`;
  return getRequest({ requestUrl });
};