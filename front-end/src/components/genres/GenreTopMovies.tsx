import React from "react";
import { useQuery } from "react-query";
import { getGenreTopMovies } from "../../api/genres";
import { queriesKeys } from "../../api/queriesKeys";
import { CarouselResults } from "../general/CarouselResults";
import { OneMovie, placeholderMovie } from "../movies/OneMovie";

interface GenreTopMoviesProps {
  name: string;
}

export const GenreTopMovies = ({ name }: GenreTopMoviesProps) => {
  const { data, isLoading, isError } = useQuery(
    [queriesKeys["getGenreTopMovies"], name],
    () => getGenreTopMovies(name),
    {
      enabled: !!name,
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <CarouselResults
      data={data?.data}
      isLoading={isLoading}
      title={name}
      width={"100%"}
      oneResultComponent={<OneMovie {...placeholderMovie} />}
      isSmallList
    />
  );
};
