import { queriesKeys } from "../../api/queriesKeys";
import { Results } from "../general/Results";
import { Stack, Typography } from "@mui/material";
import { usePagination } from "../../hooks/usePagination";
import { MovieCard } from "./MovieCard";
import { placeholderMovie } from "./OneMovie";

interface MoviesListProps {
  itemWidth?: number;
}

export const MoviesList = ({ itemWidth }: MoviesListProps) => {
  const sort_by_options = ["title"];

  const { noMore, all, isLoading, onNextPage, onPreviousPage } = usePagination({
    sort_by_options,
    name: "movies",
    keyField: "id",
    queryFnFirstKey: queriesKeys.getEntities("movies"),
    requestUrl: `/movies`,
  });

  return (
    <Stack spacing={1}>
      <Typography variant="h6" sx={{ paddingLeft: "18px !important" }}>
        All Movies
      </Typography>
      <Results
        data={all}
        isLoading={isLoading}
        noMore={noMore}
        onNextPage={onNextPage}
        keyword="data"
        oneComponent={<MovieCard {...placeholderMovie} />}
        itemWidth={itemWidth}
      />
    </Stack>
  );
};
