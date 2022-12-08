import { Alert, Grid } from "@mui/material";
import React, {
  cloneElement,
  ReactElement,
} from "react";
import Spinner from "./Spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { TempleBuddhist } from "@mui/icons-material";

export interface ResultsProps {
  data?: any[];
  isLoading: boolean;
  noMore: boolean;
  onNextPage: () => void;
  oneComponent: any;
  keyword?: string;
  itemWidth?: number;
  isMovies?: boolean;
  existingRatings?: any[];
  predictedRatings?: any[];
}

export const Results = ({
  data,
  isLoading,
  noMore,
  onNextPage,
  oneComponent,
  keyword = "data",
  itemWidth,
  isMovies,
  existingRatings,
  predictedRatings,
}: ResultsProps) => {
  if (isLoading && !data?.length) {
    return <Spinner />;
  }
  if (!data?.length) {
    return <Alert severity="info">No {keyword} found</Alert>;
  }

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={onNextPage}
      hasMore={!noMore}
      loader={<Spinner />}
      style={{ overflowY: "hidden", paddingBottom: 20 }}
    >
      <Grid container spacing={2} paddingLeft={3}>
        {data?.map((datum) => {
          return (
            <Grid
              item
              key={datum?.id}
              xl={2}
              lg={3}
              md={4}
              sm={6}
              xs={12}
              minWidth={itemWidth}
            >
              {cloneElement(oneComponent as ReactElement, {
                ...datum,
                ...(isMovies && {
                  predicted_rating: predictedRatings?.[datum.id],
                  existing_rating: existingRatings?.[datum.id],
                }),
              })}
            </Grid>
          );
        })}
      </Grid>
    </InfiniteScroll>
  );
};
