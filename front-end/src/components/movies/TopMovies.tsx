import React from "react";
import { useQuery } from "react-query";
import { getTopMovies } from "../../api/movies";
import { queriesKeys } from "../../api/queriesKeys";
import { useAppSelector } from "../../redux/hooks";
import { selectRatings } from "../../redux/slices/ratingsSlice";
import { CarouselResults } from "../general/CarouselResults";
import { OneMovie, placeholderMovie } from "./OneMovie";

export const TopMovies = () => {
  const { existingRatings, predictedRatings } = useAppSelector(selectRatings);
  const { data, isLoading } = useQuery(
    queriesKeys["getTopMovies"],
    () => getTopMovies(),
    {
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <CarouselResults
      data={data?.data}
      isLoading={isLoading}
      title="Top Movies"
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
