import React, { useEffect } from "react";
import { PageSkeleton } from "./PageSkeleton";
import { MyHeader } from "../components/general/MyHeader";
import { useAppDispatch } from "../redux/hooks";
import { setRoutes } from "../redux/slices/breadCrumbSlice";
import { Grid, Stack, Typography } from "@mui/material";

export const NotFound = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setRoutes({
        routes: [
          {
            text: "MovieOn",
            href: "/",
          },
          {
            text: "NotFound",
            href: "#",
          },
        ],
      })
    );
  }, []);

  return (
    <PageSkeleton>
      <Stack
        spacing={2}
        alignItems="center"
        justifyContent="center"
        minHeight="70vh"
        width="100%"
      >
        <Typography variant="h3" align="center">
          404
        </Typography>
        <Typography variant="h6" align="center">
          Page Not Found
        </Typography>
      </Stack>
    </PageSkeleton>
  );
};
