import { queriesKeys } from "../../api/queriesKeys";
import { Results } from "../general/Results";
import { Grid, Stack, Typography } from "@mui/material";
import { usePagination } from "../../hooks/usePagination";
import { MovieCard } from "./MovieCard";
import { placeholderMovie } from "./OneMovie";
import { selectRatings } from "../../redux/slices/ratingsSlice";
import { useAppSelector } from "../../redux/hooks";

interface MoviesListProps {
  itemWidth?: number;
}

export const MoviesList = ({ itemWidth }: MoviesListProps) => {
  const { existingRatings, predictedRatings } = useAppSelector(selectRatings);
  const sort_by_options = ["release_date", "title"];

  const {
    noMore,
    all,
    isLoading,
    onNextPage,
    onPreviousPage,
    PaginationFilters,
  } = usePagination({
    sort_by_options,
    name: "movies",
    keyField: "id",
    queryFnFirstKey: queriesKeys.getEntities("movies"),
    requestUrl: `/movies`,
  });

  return (
    <Stack spacing={3}>
      <div id="pagination-start" />
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h6" sx={{ paddingLeft: 2 }}>
            Movies
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
        itemWidth={itemWidth}
        isMovies
        existingRatings={existingRatings}
        predictedRatings={predictedRatings}
        predicted_setting_up={Object.keys(predictedRatings || {}).length == 0}
      />
    </Stack>
  );
};
