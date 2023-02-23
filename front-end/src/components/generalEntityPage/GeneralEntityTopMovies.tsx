import React from "react";
import { useQuery } from "react-query";
import { getTopConnectedMovies } from "../../api/movies";
import { queriesKeys } from "../../api/queriesKeys";
import { useAppSelector } from "../../redux/hooks";
import { selectRatings } from "../../redux/slices/ratingsSlice";
import { CarouselResults } from "../general/CarouselResults";
import { OneMovie, placeholderMovie } from "../movies/OneMovie";

interface GeneralEntityTopMoviesProps {
  entityName: string;
  name: string;
  keyValue: string;
  isSmallList?: boolean;
  titleIsHref?: boolean;
}

export const GeneralEntityTopMovies = ({
  entityName,
  name,
  keyValue,
  isSmallList = true,
  titleIsHref = true,
}: GeneralEntityTopMoviesProps) => {
  const { existingRatings, predictedRatings } = useAppSelector(selectRatings);
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
      titleHref={titleIsHref ? `/${entityName}/${keyValue}` : ""}
      width={"100%"}
      oneResultComponent={<OneMovie {...placeholderMovie} />}
      isSmallList={isSmallList}
      datumType="movie"
      existingRatings={existingRatings}
      predictedRatings={predictedRatings}
    />
  );
};
