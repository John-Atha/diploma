import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Grid, Stack } from "@mui/material";
import { PageSkeleton } from "./PageSkeleton";
import { TopMovies } from "../components/movies/TopMovies";
import { LatestMovies } from "../components/movies/LatestMovies";
import { TopGenres } from "../components/genres/TopGenres";
import { Summary } from "../components/dashboard/Summary";
import { TopPeople } from "../components/people/TopPeople";
import { TopKeywords } from "../components/keywords/TopKeywords";
import useMeasure from "react-use-measure";
import { MyHeader } from "../components/general/MyHeader";
import { useAppDispatch } from "../redux/hooks";
import { setRoutes } from "../redux/slices/breadCrumbSlice";
import { MoviesList } from "../components/movies/MoviesList";
import { RecommendedMovies } from "../components/movies/RecommendedMovies";

export const App = () => {
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
            text: "Dashboard",
            href: "#",
          },
        ],
      })
    );
  }, []);

  return (
    <PageSkeleton>
      <div ref={ref}></div>
      <Grid
        container
        rowSpacing={2}
        spacing={1}
        justifyContent="center"
        width={bounds.width}
      >
        {/* <Grid item xs={12}>
          <Summary />
        </Grid> */}
        <Grid item xs={12}>
          <MyHeader
            searchProps={{
              initValue: "",
              placeholder: `Search for a movie...`,
              entityName: "Movies",
            }}
          />{" "}
        </Grid>
        <Grid item xs={9}>
          <Stack>
            <LatestMovies />
            <RecommendedMovies />
            <TopMovies />
            <TopPeople />
          </Stack>
        </Grid>
        <Grid item xs={3}>
          <Stack
            width={"inherit"}
            spacing={1}
            height={1}
            alignItems="flex-start"
            paddingTop={3}
          >
            <TopGenres />
            <TopKeywords />
          </Stack>
        </Grid>
      </Grid>
    </PageSkeleton>
  );
};
