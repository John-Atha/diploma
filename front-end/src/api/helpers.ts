import axios from "axios";
import { getCookie } from "../helpers/cookies";
import { pagiStep } from "./config";

export const buildAuthHeader = () => {
    const token = getCookie("token");
    const header = {
        "Authorization": `Bearer ${token}`,
    };
    console.log({ header })
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