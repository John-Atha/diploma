import { Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import useMeasure from "react-use-measure";
import { getEntities } from "../api/general";
import { queriesKeys } from "../api/queriesKeys";
import { MyHeader } from "../components/general/MyHeader";
import { SecondaryEntitiesList } from "../components/general/SecondaryEntitiesList";
import { OneMovie, placeholderMovie } from "../components/movies/OneMovie";
import { useAppDispatch } from "../redux/hooks";
import { setRoutes } from "../redux/slices/breadCrumbSlice";
import { PageSkeleton } from "./PageSkeleton";

export const MoviesPage = () => {
  const dispatch = useAppDispatch();
  const [ref, bounds] = useMeasure();
  const [page, setPage] = useState(1);

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
            <Typography variant="h6">Movies</Typography>
            <SecondaryEntitiesList
              name="movies"
              keyField="id"
              sort_by="release_date"
              order="asc"
              itemWidth={250}
              component={<OneMovie {...placeholderMovie} width={300} />}
            />
          </Stack>
        </>
      }
    />
  );
};
