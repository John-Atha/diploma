import { Grid, Stack, Typography } from "@mui/material";
import React from "react";
import { authApiUrl } from "../../api/config";
import { queriesKeys } from "../../api/queriesKeys";
import { usePagination } from "../../hooks/usePagination";
import { useAppSelector } from "../../redux/hooks";
import { selectAuthUser } from "../../redux/slices/authSlice";
import { selectRatings } from "../../redux/slices/ratingsSlice";
import { Results } from "../general/Results";
import { MovieCard } from "../movies/MovieCard";
import { placeholderMovie } from "../movies/OneMovie";

export const RatingsHistory = () => {
  const { username } = useAppSelector(selectAuthUser);
  const { existingRatings, predictedRatings } = useAppSelector(selectRatings);

  const {
    noMore,
    all,
    isLoading,
    onNextPage,
    onPreviousPage,
    PaginationFilters,
  } = usePagination({
    sort_by_options: ["datetime", "rating"],
    name: "ratings",
    keyField: "movie_id",
    queryFnFirstKey: queriesKeys.getEntities("ratings"),
    requestUrl: `${authApiUrl}/ratings/users/${username}`,
    datumTransform: ({ movie, rating, rating_datetime }: any) => ({
      ...movie,
      rating,
      rating_datetime,
    }),
  });

  return (
    <Stack spacing={3}>
      <div id="pagination-start" />
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h6" sx={{ paddingLeft: 2 }}>
            My Ratings
          </Typography>
        </Grid>
        <Grid item width={300}>
          {PaginationFilters}
        </Grid>
      </Grid>
      <Results
        data={all}
        isLoading={isLoading}
        noMore={noMore}
        onNextPage={onNextPage}
        keyword="data"
        oneComponent={<MovieCard {...placeholderMovie} />}
        itemWidth={200}
        isMovies
        existingRatings={existingRatings}
        predictedRatings={predictedRatings}
        predicted_setting_up={Object.keys(predictedRatings || {}).length == 0}
      />
    </Stack>
  );
};
