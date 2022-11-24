import axios from "axios";
import { apiUrl } from "./config";
import { getRequest } from "./helpers";

axios.defaults.baseURL = apiUrl;

export const getTopKeywords = async () => {
  const requestUrl = `/keywords`;
  const params = { sort_by: "movies_count", order: "desc", size: 10 };
  return getRequest({ requestUrl, params });
};
