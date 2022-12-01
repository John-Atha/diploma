import axios from "axios";
import { pagiStep } from "./config";

export const buildAuthHeader = () => {
    const token = localStorage.getItem("token");
    const header = {
        "Authorization": `token ${token}`,
    };
    return header;
}

interface GetProps {
    requestUrl: string,
    headers?: any,
    params?: any,
}

export const getRequest = async ({ requestUrl, headers, params }: GetProps) => {
    return axios.get(
        requestUrl,
        {
            ...(headers && { headers }),
            params: {
                per_page: pagiStep,
                size: pagiStep,
                ...params,
            },
        }
    ).then(response => {
        // console.log(response.data);
        return response.data;
    }).catch(err => {
        console.log(err);
        throw err;
    })
}