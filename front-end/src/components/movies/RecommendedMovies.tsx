import React from "react";
import { useQuery } from "react-query";
import { getLatestMovies, getTopMovies } from "../../api/movies";
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

  console.log(data)

  return (
    <CarouselResults
      data={data}
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
