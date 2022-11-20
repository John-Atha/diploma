import axios from "axios";
import { apiUrl } from "./config";
import { buildAuthHeader, getRequest } from "./helpers";
import { FamousProps } from "./user";

axios.defaults.baseURL = apiUrl;

interface getReposProps {
    username?: string,
    page?: number,
}

export const getRepos = async ({ username, page }: getReposProps) => {
    const requestUrl = `/users/${username}/repos`;
    const headers = buildAuthHeader();
    const params = { page };
    return getRequest({ requestUrl, headers, params });
}

interface getRepoParticipationProps {
    username: string,
    repoName: string,
}

export const getRepoParticipation = async ({ username, repoName }: getRepoParticipationProps) => {
    const requestUrl = `/repos/${username}/${repoName}/stats/participation`;
    const headers = buildAuthHeader();
    return getRequest({ requestUrl, headers });
}

export const get100LatestRepos = async ({ username }: getReposProps) => {
    const requestUrl = `/users/${username}/repos`;
    const params = {
        per_page: 100,
        sort: "updated",
        order: "desc"
    };
    const headers = buildAuthHeader();
    return getRequest({ requestUrl, headers, params });
}

export const getFamousRepos = async ({ limit=10 }: FamousProps) => {
    const requestUrl = `https://api.github.com/search/repositories`;
    const headers = buildAuthHeader();
    const params = {
        q: `stars:>1000`,
        page: 1,
        per_page: limit,
        sort: 'stars',
        order: 'desc',
    };
    return getRequest({ requestUrl, headers, params });
}

export interface GetLanguageRepoProps {
    lang: string,
    page: number,
    per_page?: number
}
export const getReposByLang = async ({ lang, page, per_page=10 }: GetLanguageRepoProps) => {
    const requestUrl = `https://api.github.com/search/repositories`
    const headers = buildAuthHeader();
    const params = {
       q: `language:${lang}`,
       per_page,
       page,
       sort: 'stars',
       order: 'desc', 
    };
    return getRequest({ requestUrl, headers, params });
}

export interface GetRepoProps {
    username: string | null,
    repoName: string | null,
}
export const getOneRepo = async ({ username, repoName }: GetRepoProps) => {
    const requestUrl = `https://api.github.com/repos/${username}/${repoName}`;
    const headers = buildAuthHeader();
    return getRequest({ requestUrl, headers });
}

export const GetRepoDailyCommits = async ({ username, repoName }: GetRepoProps) => {
    const requestUrl = `https://api.github.com/repos/${username}/${repoName}/stats/commit_activity`;
    const headers = buildAuthHeader();
    return getRequest({ requestUrl, headers });
}