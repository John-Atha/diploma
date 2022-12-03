import { Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import useMeasure from "react-use-measure";
import { MyHeader } from "../components/general/MyHeader";
import { MoviesList } from "../components/movies/MoviesList";
import { useAppDispatch } from "../redux/hooks";
import { setRoutes } from "../redux/slices/breadCrumbSlice";
import { PageSkeleton } from "./PageSkeleton";

export const MoviesPage = () => {
  const dispatch = useAppDispatch();
  const [ref, bounds] = useMeasure();

  useEffect(() => {
    dispatch(
      setRoutes({
        routes: [
          {
            text: "MovieOn",
            href: "/",
          },
          {
            text: "Movies",
            href: `/movies`,
          },
        ],
      })
    );
  }, []);

  return (
    <PageSkeleton
      children={
        <>
          <div ref={ref} />
          <Stack spacing={2} width={bounds.width}>
            <Grid item xs={12}>
              <MyHeader
                searchProps={{
                  initValue: "",
                  placeholder: `Search for a Movie...`,
                }}
              />
            </Grid>
            <MoviesList itemWidth={250} />
          </Stack>
        </>
      }
    />
  );
};
