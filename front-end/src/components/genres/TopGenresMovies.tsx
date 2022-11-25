import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getTopGenres } from "../../api/genres";
import { queriesKeys } from "../../api/queriesKeys";
import { SecondaryEntityProps } from "../general/OneSecondaryEntity";
import { GenreTopMovies } from "./GenreTopMovies";

export const TopGenresMovies = () => {
  const { data, isLoading, isError } = useQuery(
    [queriesKeys["getTopGenres"]],
    () => getTopGenres(),
    {
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  const [topGenres, setTopGenres] = useState([]);

  useEffect(() => {
    if (data?.data?.length && !isLoading) {
      setTopGenres(
        data?.data?.slice(0, 4).map(({ name }: SecondaryEntityProps) => name)
      );
    }
  }, [data, isLoading]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sx={{ paddingLeft: "24px !important" }}>
        <Typography variant="h6">Top Genres</Typography>
      </Grid>
      {topGenres.map((name) => (
        <Grid item md={6} xs={12} key={name}>
          <GenreTopMovies name={name} />
        </Grid>
      ))}
    </Grid>
  );
};
