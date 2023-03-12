import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { queriesKeys } from "../../api/queriesKeys";
import { getRecommendedMovies } from "../../api/ratings";
import { useAppSelector } from "../../redux/hooks";
import { selectAuthUser } from "../../redux/slices/authSlice";
import { selectRatings } from "../../redux/slices/ratingsSlice";
import { CarouselResults } from "../general/CarouselResults";
import { OneMovie, placeholderMovie } from "./OneMovie";

export const RecommendedMovies = () => {
  const { existingRatings, predictedRatings } = useAppSelector(selectRatings);
  const { id: userId } = useAppSelector(selectAuthUser);

  const { data, isLoading } = useQuery(
    [queriesKeys["getRecommendedMovies"], userId],
    () => getRecommendedMovies(userId, 30),
    {
      enabled: !!userId,
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  const [sorted, setSorted] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      // sort data be the corresponding predicted rating without mutating the original data
      const sortedData: any[] = [...data].sort((a, b) => {
        const aRating = predictedRatings[a.id];
        const bRating = predictedRatings[b.id];
        if (aRating > bRating) return -1;
        if (aRating < bRating) return 1;
        return 0;
      });
      setSorted(sortedData);
    }
  }, [data, predictedRatings]);

  return (
    <CarouselResults
      data={sorted}
      isLoading={isLoading}
      title="Just for you"
      width={"100%"}
      // maxWidth="900px"
      oneResultComponent={<OneMovie {...placeholderMovie} />}
      datumType="movie"
      existingRatings={existingRatings}
      predictedRatings={predictedRatings}
      predicted_setting_up={Object.keys(predictedRatings || {}).length == 0}
    />
  );
};
