import React, { cloneElement, ReactElement, useEffect, useState } from "react";
import { queriesKeys } from "../../api/queriesKeys";
import { Results } from "../general/Results";
import { Stack, Typography } from "@mui/material";
import { usePagination } from "../../hooks/usePagination";

interface SecondaryEntitiesListProps {
  name: string;
  component: ReactElement;
  keyField: string;
  itemWidth?: number;
}

export const SecondaryEntitiesList = ({
  name,
  component,
  keyField,
  itemWidth,
}: SecondaryEntitiesListProps) => {
  const sort_by_options = ["movies_count", "name"];

  const { noMore, all, isLoading, onNextPage, onPreviousPage } = usePagination({
    sort_by_options,
    name,
    keyField,
    queryFnFirstKey: queriesKeys.getEntities(name),
    requestUrl: `/${name}`,
  });

  return (
    <Stack spacing={1}>
      <Typography variant="h6" sx={{ paddingLeft: "18px !important" }}>
        All {name}
      </Typography>
      <Results
        data={all}
        isLoading={isLoading}
        noMore={noMore}
        onNextPage={onNextPage}
        keyword="data"
        oneComponent={cloneElement(component)}
        itemWidth={itemWidth}
      />
    </Stack>
  );
};
