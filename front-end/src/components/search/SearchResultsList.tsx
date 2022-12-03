import { Paper, Stack, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import { getEntities, searchEntities } from "../../api/general";
import { queriesKeys } from "../../api/queriesKeys";
import Spinner from "../general/Spinner";
import { SearchResult } from "./SearchResult";

export const SearchResultsList = () => {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading } = useQuery(
    [
      queriesKeys["getSearch"],
      searchParams.get("entity"),
      searchParams.get("key"),
    ],
    () =>
      searchEntities(
        searchParams.get("entity") as string,
        searchParams.get("key") as string
      ),
    {
      enabled: !!searchParams.get("entity") && !!searchParams.get("key"),
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <Paper sx={{ padding: 2, minHeight: 400, maxHeight: "70vh", paddingBottom: 5 }}>
      <Stack spacing={1} maxHeight="65vh" sx={{ overflowY: "auto" }}>
        <Typography variant="h6">{searchParams.get("entity")}</Typography>
        {isLoading && <Spinner />}
        {!isLoading &&
          !data?.data?.length &&
          !!searchParams.get("key")?.length && (
            <Typography
              variant="h6"
              sx={{ marginTop: 2 }}
              color={theme.palette.primary.light}
            >
              No {searchParams.get("entity")} found.
            </Typography>
          )}
        {!isLoading && !!(data as any)?.data?.length && (
          <Stack spacing={1}>
            {(data as any).data.map((datum: any, index: number) => (
              <SearchResult
                key={index}
                datum={datum}
                entityName={searchParams.get("entity") as string}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};
