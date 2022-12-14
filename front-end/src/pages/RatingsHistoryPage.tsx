import { Button, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { MyHeader } from "../components/general/MyHeader";
import { ProfileTabs } from "../components/profile/ProfileTabs";
import { RatingsHistory } from "../components/ratings/RatingsHistory";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectAuthUser } from "../redux/slices/authSlice";
import { setRoutes } from "../redux/slices/breadCrumbSlice";
import { PageSkeleton } from "./PageSkeleton";

export const RatingsHistoryPage = () => {
  const dispatch = useAppDispatch();
  const { id } = useAppSelector(selectAuthUser);

  useEffect(() => {
    dispatch(
      setRoutes({
        routes: [
          {
            text: "MovieOn",
            href: "/",
          },
          {
            text: "My Ratings",
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
        {...(!id && {
          alignItems: "center",
          paddingTop: "20vh",
          height: "80vh",
        })}
      >
        <MyHeader
          searchProps={{
            initValue: "",
            placeholder: `Search for a Movie...`,
            entityName: "Movies",
          }}
        />
        {!!id && <RatingsHistory />}
        {!id && (
          <>
            <Typography variant="h6">
              Access to this page is allowed only for authenticated users
            </Typography>
            <NavLink to="/profile?auth=signup">Create Account</NavLink>
          </>
        )}
      </Stack>
    </PageSkeleton>
  );
};
