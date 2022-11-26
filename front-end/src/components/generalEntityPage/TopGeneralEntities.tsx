import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getTopEntities } from "../../api/general";
import { queriesKeys } from "../../api/queriesKeys";
import { GeneralEntityLatestMovies } from "./GeneralEntityLatestMovies";

export interface GeneralEntityTopConnectedMoviesProps {
  entityName: string;
  headerName: string;
  keyField: string;
}

export const TopGeneralEntities = ({
  entityName,
  headerName,
  keyField,
}: GeneralEntityTopConnectedMoviesProps) => {
  const { data, isLoading, isError } = useQuery(
    [queriesKeys.getTopEntities(entityName)],
    () => getTopEntities(entityName),
    {
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  const [topEntities, setTopEntities] = useState([]);

  useEffect(() => {
    if (data?.data?.length && !isLoading) {
      setTopEntities(
        data?.data
          ?.slice(0, 4)
          .map(({ name, [keyField]: keyValue }: any) => ({ name, keyValue }))
      );
    }
  }, [data, isLoading]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sx={{ paddingLeft: "24px !important" }}>
        <Typography variant="h6">Top {headerName}</Typography>
      </Grid>
      {topEntities.map(({ name, keyValue }) => (
        <Grid item md={6} xs={12} key={name}>
          <GeneralEntityLatestMovies
            entityName={entityName}
            name={name}
            keyValue={keyValue}
          />
        </Grid>
      ))}
    </Grid>
  );
};
