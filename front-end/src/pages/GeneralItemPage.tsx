import { Grid, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import useMeasure from "react-use-measure";
import { getOneEntity } from "../api/general";
import { getConnectedMovies } from "../api/movies";
import { queriesKeys } from "../api/queriesKeys";
import { GeneralEntityLatestMovies } from "../components/generalEntityPage/GeneralEntityLatestMovies";
import { GeneralEntityTopMovies } from "../components/generalEntityPage/GeneralEntityTopMovies";
import { GraphVisual } from "../components/graphVisualization/GraphVisual";
import { useAppDispatch } from "../redux/hooks";
import { setRoutes } from "../redux/slices/breadCrumbSlice";
import { PageSkeleton } from "./PageSkeleton";

export interface GeneralItemPageProps {
  entityName: string;
  keyField: string | number;
  headerName: string;
}

export const GeneralItemPage = ({
  entityName,
  keyField,
  headerName,
}: GeneralItemPageProps) => {
  const dispatch = useAppDispatch();
  const { [keyField]: keyValue } = useParams();
  const [ref, bounds] = useMeasure();

  const { data, isLoading } = useQuery(
    [queriesKeys.getOneEntity(entityName), keyValue],
    () => getOneEntity(entityName, keyValue as string),
    {
      enabled: !!keyValue,
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  const { data: visData, isLoading: visLoading, isError: visError } = useQuery(
    [queriesKeys.getConnectedMovies(entityName), keyValue],
    () => getConnectedMovies(entityName, keyValue as string),
    {
      enabled: !!keyValue,
      cacheTime: 1000,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    dispatch(
      setRoutes({
        routes: [
          {
            text: "MovieOn",
            href: "/",
          },
          {
            text: headerName,
            href: `/${entityName}`,
          },
          {
            text: data?.name || keyValue,
            href: "#",
          },
        ],
      })
    );
  }, [data]);

  return (
    <PageSkeleton
      children={
        <>
          <div ref={ref} />
          <Stack spacing={2} width={bounds.width}>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="h6">
                  {!!data && `${data["name"]}`}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2">
                  {!!data && `(${data["movies_count"]} movies)`}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item sm={6} xs={12}>
                <GeneralEntityLatestMovies
                  entityName={entityName}
                  name="Latest Movies"
                  keyValue={keyValue as string}
                  titleIsHref={false}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <GeneralEntityTopMovies
                  entityName={entityName}
                  name="Top Movies"
                  keyValue={keyValue as string}
                  titleIsHref={false}
                />
              </Grid>
            </Grid>
            <GraphVisual
              width={bounds.width}
              entityName={entityName}
              keyValue={keyValue as string}
              nodeLabel={data?.name}
              centralNode={data}
              data={visData}
              isLoading={visLoading}
              isError={visError}
            />
          </Stack>
        </>
      }
    />
  );
};
