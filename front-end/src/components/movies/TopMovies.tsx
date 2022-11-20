import React from "react";
import { useQuery } from "react-query";
import { getTopMovies } from "../../api/movies";
import { queriesKeys } from "../../api/queriesKeys";
import { CarouselResults } from "../general/CarouselResults";
import { OneMovie, placeholderMovie } from "./OneMovie";

export const TopMovies = () => {
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
      width={"80vw"}
      maxWidth="1200px"
      oneResultComponent={<OneMovie {...placeholderMovie} />}
    />
  );
};
