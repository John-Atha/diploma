import axios from "axios";
import { apiUrl } from "./config";
import { getRequest } from "./helpers";

axios.defaults.baseURL = apiUrl;

export const getTopPeople = async () => {
  const requestUrl = `/people`;
  const params = { sort_by: "movies_count", order: "desc" };
  return getRequest({ requestUrl, params });
};
