import React from "react";
import { useQuery } from "react-query";
import { getGenreTopMovies } from "../../api/genres";
import { getLatestConnectedMovies } from "../../api/movies";
import { queriesKeys } from "../../api/queriesKeys";
import { CarouselResults } from "../general/CarouselResults";
import { OneMovie, placeholderMovie } from "../movies/OneMovie";

interface GeneralEntityLatestMoviesProps {
  entityName: string;
  name: string;
  keyValue: string;
  isSmallList?: boolean;
  titleIsHref?: boolean;
}

export const GeneralEntityLatestMovies = ({
  entityName,
  name,
  keyValue,
  isSmallList = true,
  titleIsHref = true,
}: GeneralEntityLatestMoviesProps) => {
  const { data, isLoading, isError } = useQuery(
    [queriesKeys.getLatestConnectedMovies(entityName), keyValue],
    () => getLatestConnectedMovies(entityName, keyValue),
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
      titleHref={titleIsHref ? `/${entityName}/${keyValue}` : ""}
      width={"100%"}
      oneResultComponent={<OneMovie {...placeholderMovie} />}
      isSmallList={isSmallList}
    />
  );
};
