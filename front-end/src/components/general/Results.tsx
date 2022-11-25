import { Alert, Grid } from "@mui/material";
import React, { cloneElement, ReactElement, useEffect, useState } from "react";
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
}

export const Results = ({
  data,
  isLoading,
  noMore,
  onNextPage,
  oneComponent,
  keyword = "data",
}: ResultsProps) => {
  if (isLoading && !data) {
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
      <Grid container spacing={2} justifyContent="center">
        {data?.map((datum) => {
          return (
            <Grid item key={datum?.id}>
              {cloneElement(oneComponent as ReactElement, { ...datum })}
            </Grid>
          );
        })}
      </Grid>
    </InfiniteScroll>
  );
};
