import axios from "axios";
import { apiUrl } from "./config";
import { buildAuthHeader, getRequest } from "./helpers";

axios.defaults.baseURL = apiUrl;

export const checkLoggedCall = () => {
    const requestUrl = "/user";
    const headers = buildAuthHeader();
    return getRequest({ requestUrl, headers });
}


