import axios from "axios";
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

interface RatingProps {
  movieId: number;
  userId: number;
  rating: number;
}

export const createRatingCall = (rating: RatingProps) => {
  const requestUrl = `${authApiUrl}/ratings`;
  const headers = buildAuthHeader();
  return axios.post(requestUrl, rating, { headers });
}

export const updateRatingCall = (rating: RatingProps) => {
  const requestUrl = `${authApiUrl}/ratings`;
  const headers = buildAuthHeader();
  return axios.put(requestUrl, rating, { headers });
}