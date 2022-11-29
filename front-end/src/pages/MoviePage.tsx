import React, { useEffect } from "react";
import { Grid, Stack } from "@mui/material";
import { PageSkeleton } from "./PageSkeleton";
import useMeasure from "react-use-measure";
import { MyHeader } from "../components/general/MyHeader";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectBreadCrumbRoutes, setRoutes } from "../redux/slices/breadCrumbSlice";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { queriesKeys } from "../api/queriesKeys";
import { getOneEntity } from "../api/general";

export const MoviePage = () => {
  const dispatch = useAppDispatch();
  const [ref, bounds] = useMeasure();
  const { id } = useParams();
  const { routes } = useAppSelector(selectBreadCrumbRoutes);

  const { data, isLoading, isError } = useQuery(
    [queriesKeys['getOneEntity'], id],
    () => getOneEntity("movies", `${id}`), {
        enabled: !!id,
        cacheTime: 0,
        refetchOnWindowFocus: false,
    }
  )

  useEffect(() => {
    dispatch(
      setRoutes({
        routes: [
          {
            text: "MovieOn",
            href: "/",
          },
          {
            text: "Movies",
            href: "/",
          }
        ],
      })
    );
  }, []);

  useEffect(() => {
    if (data && !isLoading) {
        const newRoutes: any = [...routes];
        newRoutes.push({
            text: data.title,
            href:"#",
        });
        dispatch(setRoutes({
            routes: newRoutes,
        }))
    }
  }, [data, isLoading])

  return (
    <PageSkeleton>
      <div ref={ref}></div>
      <Stack
        spacing={2}
        justifyContent="center"
        width={bounds.width}
      >
          <MyHeader
            searchProps={{
              initValue: "",
              placeholder: `Search for a movie...`,
            }}
          />{" "}
        
      </Stack>
    </PageSkeleton>
  );
};
