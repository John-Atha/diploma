import { useEffect } from "react";
import { useQuery } from "react-query";
import { queriesKeys } from "../api/queriesKeys";
import {
  getBriefExistingRatingsCall,
  getPredictedRatingsCall,
} from "../api/ratings";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectAuthUser } from "../redux/slices/authSlice";
import {
  setExistingRatings,
  setPredictedRatings,
} from "../redux/slices/ratingsSlice";

export const useRatings = () => {
  const dispatch = useAppDispatch();
  const { id, username } = useAppSelector(selectAuthUser);

  const {
    data: existingRatings,
    isLoading: existingRatingsLoading,
    isError: existingRatingsError,
  } = useQuery(
    [queriesKeys.getUserExistingRatingsBrief, username],
    () => getBriefExistingRatingsCall(username),
    {
      enabled: !!username,
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: predictedRatings,
    isLoading: predictedRatingsLoading,
    isError: predictedRatingsError,
  } = useQuery(
    [queriesKeys.getUserPredictedRatingsBrief, id],
    () => getPredictedRatingsCall(id),
    {
      enabled: !!id,
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (!!existingRatings && !existingRatingsLoading) {
      const ratingsAsObject: any = {};
      existingRatings["existingRatings"]?.forEach(
        ({ movie_id, rating }: any) => {
          ratingsAsObject[movie_id] = rating.toFixed(1);
        }
      );
      dispatch(
        setExistingRatings({
          existingRatings: ratingsAsObject,
        })
      );
    }
  }, [existingRatings, existingRatingsLoading]);

  useEffect(() => {
    if (!!predictedRatings && !predictedRatingsLoading) {
      const ratingsAsObject: any = {};
      predictedRatings["predictedRatings"]?.forEach(
        ({ movie_id, rating }: any) => {
          ratingsAsObject[movie_id] = rating.toFixed(1);
        }
      );
      dispatch(
        setPredictedRatings({
          predictedRatings: ratingsAsObject,
        })
      );
    }
  }, [predictedRatings, predictedRatingsLoading]);
};
