import axios from "axios";
import { apiUrl } from "./config";
import { buildAuthHeader, getRequest } from "./helpers";

axios.defaults.baseURL = apiUrl;

interface getUserProps {
    username: string,
    page?: number,
}

export const getUser = async ({ username }: getUserProps) => {
    const requestUrl = `/users/${username}`;
    const headers = buildAuthHeader();
    return getRequest({ requestUrl, headers });
}

export const getFollowers = async ({ username, page }: getUserProps) => {
    const requestUrl = `/users/${username}/followers`;
    const headers = buildAuthHeader();
    const params = { page };
    return getRequest({ requestUrl, headers, params });
}

export const getFollows = async ({ username, page }: getUserProps) => {
    const requestUrl = `/users/${username}/following`;
    const headers = buildAuthHeader();
    const params = { page };
    return getRequest({ requestUrl, headers, params });
}

export const getStarredRepos = async ({ username }: getUserProps) => {
    const requestUrl = `/users/${username}/starred`;
    const headers = buildAuthHeader();
    const params = {
        per_page: 10,
        page: 1,
        sort: "stars",
        order: "desc",
    };
    return getRequest({ requestUrl, headers, params });
}

export interface FamousProps {
    limit?: number,
}

export const getFamousUsers = async ({ limit=10 }: FamousProps) => {
    const requestUrl = `https://api.github.com/search/users`;
    const headers = buildAuthHeader();
    const params = {
        q: `followers:>1000`,
        page: 1,
        per_page: limit,
        sort: `followers`,
        order: `desc`,
    };
    return getRequest({ requestUrl, headers, params });
}

export interface GetAllUsersProps {
    type?: string,
}
export const getAllUsers = async ({ type=`User` }: GetAllUsersProps) => {
    const requestUrl = `https://api.github.com/search/users`
    const params = {
        q: `type:${type}`,
        per_page: 1,
        page: 1,
    };
    const headers = buildAuthHeader();
    return getRequest({ requestUrl, headers, params });
}