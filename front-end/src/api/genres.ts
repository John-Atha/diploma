import axios from "axios";
import { apiUrl } from "./config";
import { getRequest } from "./helpers";

axios.defaults.baseURL = apiUrl;

export const getTopGenres = async () => {
  const requestUrl = `/genres`;
  const params = { sort_by: "movies_count", order: "desc" };
  return getRequest({ requestUrl, params });
};