import { authApiUrl } from "./config";
import { buildAuthHeader, getRequest } from "./helpers";

export const getBriefExistingRatingsCall = (username: string) => {
  const requestUrl = `${authApiUrl}/ratings/users/${username}/brief`;
  const headers = buildAuthHeader();
  return getRequest({ requestUrl, headers });
};

export const getPredictedRatingsCall = (id: number) => {
  const requestUrl = `${authApiUrl}/ratings/users/${id}/predict`;
  const headers = buildAuthHeader();
  return getRequest({ requestUrl, headers });
};
