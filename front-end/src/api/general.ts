import axios from "axios";
import { apiUrl, pagiStep } from "./config";
import { getRequest } from "./helpers";

axios.defaults.baseURL = apiUrl;

export const getSummary = async () => {
  const requestUrl = `/summary`;
  return getRequest({ requestUrl });
};

interface GetEntitiesProps {
  name: string;
  sort_by?: string;
  order?: "asc|desc";
  page: number;
  size?: number;
}
export const getEntities = async ({
  name,
  sort_by,
  order,
  page,
  size = pagiStep,
}: GetEntitiesProps) => {
  const requestUrl = `/${name}`;
  const params = { page, sort_by: "movies_count", order: "desc", size };
  return getRequest({ requestUrl, params });
};
