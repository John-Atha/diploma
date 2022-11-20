import axios from "axios";
import { apiUrl } from "./config";
import { getRequest } from "./helpers";

axios.defaults.baseURL = apiUrl;

export const getTopMovies = async () => {
  const requestUrl = `/movies`;
  const params = { sort_by: "vote_average", order: "asc" };
  return getRequest({ requestUrl, params });
};

export const getLatestMovies = async () => {
  const requestUrl = `/movies`;
  const params = { sort_by: "release_date", order: "desc" };
  return getRequest({ requestUrl, params });
};