import { CardMedia, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import useMeasure from "react-use-measure";
import { getOneEntity } from "../api/general";
import { queriesKeys } from "../api/queriesKeys";
import { GeneralEntityLatestMovies } from "../components/generalEntityPage/GeneralEntityLatestMovies";
import { GeneralEntityMovies } from "../components/generalEntityPage/GeneralEntityMovies";
import { GeneralEntityTopMovies } from "../components/generalEntityPage/GeneralEntityTopMovies";
import { GraphVisualizationForGeneralEntity } from "../components/generalEntityPage/GraphVisualizationForGeneralEntity";
import { tmdb_base_url } from "../data/cloud_base_urls";
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
  const [ref2, bounds2] = useMeasure();
  const { data, isLoading } = useQuery(
    [queriesKeys.getOneEntity(entityName), keyValue],
    () => getOneEntity(entityName, keyValue as string),
    {
      enabled: !!keyValue,
      cacheTime: 0,
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

  const renderTitle = () => (
    <Grid container alignItems="center" spacing={1}>
      <Grid item>
        <Typography variant="h6">{!!data && `${data["name"]}`}</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body2">
          {!!data && `(${data["movies_count"]} movies)`}
        </Typography>
      </Grid>
    </Grid>
  );

  console.log(`calc(100% - ${bounds2.width})`)

  return (
    <PageSkeleton
      children={
        <>
          <div ref={ref} />
          <Stack spacing={2} width={bounds.width}>
            {data?.profile_path && (
              <Grid container>
                <Grid item width="minContent" ref={ref2}>
                  <Stack spacing={1}>
                    <div style={{paddingTop: 24 }}>{renderTitle()}</div>
                    <div>
                      <img
                        src={`${tmdb_base_url}${data.profile_path}`}
                        alt={data.name}
                        style={{
                          borderRadius: 5,
                          backgroundImage:
                            "linear-gradient(to top, rgba(0, 0, 0, 1), transparent)",
                          objectFit: "contain",
                          height: 536,
                        }}
                      />
                    </div>
                  </Stack>
                </Grid>
                <Grid item sx={{ width: `calc(100% - ${bounds2.width}px)`}}>
                  <GeneralEntityLatestMovies
                    entityName={entityName}
                    name="Latest Movies"
                    keyValue={keyValue as string}
                    titleIsHref={false}
                    // isSmallList
                  />
                  <GeneralEntityTopMovies
                    entityName={entityName}
                    name="Top Movies"
                    keyValue={keyValue as string}
                    titleIsHref={false}
                    // isSmallList
                  />
                </Grid>
              </Grid>
            )}
            {!data?.profile_path && (
              <>
                {renderTitle()}
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
              </>
            )}
            <GraphVisualizationForGeneralEntity
              width={bounds.width}
              entityName={entityName}
              keyValue={keyValue as string}
              nodeLabel={data?.name}
              centralNode={data}
            />
            {!!entityName && !!keyValue && (
              <GeneralEntityMovies
                entityName={entityName}
                keyValue={keyValue as string}
                itemWidth={300}
              />
            )}
          </Stack>
        </>
      }
    />
  );
};
