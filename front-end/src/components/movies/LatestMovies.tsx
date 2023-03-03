import React from "react";
import { useQuery } from "react-query";
import { getLatestMovies, getTopMovies } from "../../api/movies";
import { queriesKeys } from "../../api/queriesKeys";
import { useAppSelector } from "../../redux/hooks";
import { selectRatings } from "../../redux/slices/ratingsSlice";
import { CarouselResults } from "../general/CarouselResults";
import { OneMovie, placeholderMovie } from "./OneMovie";

export const LatestMovies = () => {
  const { existingRatings, predictedRatings } = useAppSelector(selectRatings);

  const { data, isLoading } = useQuery(
    queriesKeys["getLatestMovies"],
    () => getLatestMovies(),
    {
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <CarouselResults
      data={data?.data}
      isLoading={isLoading}
      title="Latest Releases"
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
