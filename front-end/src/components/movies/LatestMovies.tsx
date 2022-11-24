import React from "react";
import { useQuery } from "react-query";
import { getLatestMovies, getTopMovies } from "../../api/movies";
import { queriesKeys } from "../../api/queriesKeys";
import { CarouselResults } from "../general/CarouselResults";
import { OneMovie, placeholderMovie } from "./OneMovie";

export const LatestMovies = () => {
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
    />
  );
};
