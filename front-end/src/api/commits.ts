import axios from "axios";
import { apiUrl } from "./config";
import { buildAuthHeader, getRequest } from "./helpers";
import moment from "moment";

axios.defaults.baseURL = apiUrl;

interface UserCommitsByMonthProps {
    username: string,
    month: number,
    year: number,
}

export const getUserCommitsByMonth = ({ username, year, month }: UserCommitsByMonthProps) => {
    const start_date = moment({ month , year });
    const end_date = start_date.endOf("month");
    const start = start_date.format("YYYY-MM-DD");
    const end = end_date.format("YYYY-MM-DD");
    const requestUrl = `/search/commits`;
    const params = {
        per_page: 1,
        q: `author:${username}+committer-date:${start}..${end}`,
    }
    const headers = buildAuthHeader();
    return getRequest({ requestUrl, headers, params });
}

interface UserOneCommitProps {
    username: string,
    order: "asc" | "desc",
}

export const getUserOneCommit = ({ username, order }: UserOneCommitProps) => {
    const requestUrl = `/search/commits`;
    const headers = buildAuthHeader();
    const params = {
        per_page: 1,
        q: `author:${username}+sort:committer-date-${order}`,
    }
    return getRequest({ requestUrl, headers, params });
}

