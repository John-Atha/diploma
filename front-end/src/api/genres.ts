import axios from "axios";
import { apiUrl } from "./config";
import { getRequest } from "./helpers";

axios.defaults.baseURL = apiUrl;

export const getTopGenres = async () => {
  const requestUrl = `/genres`;
  const params = { sort_by: "movies_count", order: "desc", size: 10 };
  return getRequest({ requestUrl, params });
};

export const getGenreTopMovies = async (name: string) => {
  const requestUrl = `/genres/${name}/movies`;
  const params = { sort_by: "release_date", order: "desc", size: 5 };
  return getRequest({ requestUrl, params });
}