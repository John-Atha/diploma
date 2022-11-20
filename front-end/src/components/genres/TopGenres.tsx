import React from "react";
import { useQuery } from "react-query";
import { getTopGenres } from "../../api/genres";
import { getTopMovies } from "../../api/movies";
import { queriesKeys } from "../../api/queriesKeys";
import { CarouselResults } from "../general/CarouselResults";
import { OneGenre, placeholderGenre } from "./OneGenre";

export const TopGenres = () => {
  const { data, isLoading } = useQuery(
    queriesKeys["getTopGenres"],
    () => getTopGenres(),
    {
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <CarouselResults
      data={data?.data}
      isLoading={isLoading}
      title="Top Genres"
      width={"80vw"}
      maxWidth="1200px"
      oneResultComponent={<OneGenre {...placeholderGenre} />}
    />
  );
};
