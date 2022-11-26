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

export const getTopConnectedMovies = async (entityName: string, key: string) => {
  const requestUrl = `/${entityName}/${key}/movies`;
  const params = { sort_by: "release_date", order: "desc", size: 5 };
  return getRequest({ requestUrl, params });
}