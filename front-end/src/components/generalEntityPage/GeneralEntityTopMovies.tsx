import React from "react";
import { useQuery } from "react-query";
import { getGenreTopMovies } from "../../api/genres";
import { getTopConnectedMovies } from "../../api/movies";
import { queriesKeys } from "../../api/queriesKeys";
import { CarouselResults } from "../general/CarouselResults";
import { OneMovie, placeholderMovie } from "../movies/OneMovie";

interface GeneralEntityTopMoviesProps {
  entityName: string;
  name: string;
  keyValue: string;
}

export const GeneralEntityTopMovies = ({
  entityName,
  name,
  keyValue,
}: GeneralEntityTopMoviesProps) => {
  const { data, isLoading, isError } = useQuery(
    [queriesKeys.getTopConnectedMovies(entityName), keyValue],
    () => getTopConnectedMovies(entityName, keyValue),
    {
      enabled: !!keyValue,
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
