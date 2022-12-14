import { Button, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ProfileTabs } from "../components/profile/ProfileTabs";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectAuthUser } from "../redux/slices/authSlice";
import { setRoutes } from "../redux/slices/breadCrumbSlice";
import { PageSkeleton } from "./PageSkeleton";

export const ProfilePage = () => {
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
            text: "My Profile",
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
        height={"80vh"}
        {...(!id && { alignItems: "center", paddingTop: "20vh" })}
      >
        {!!id && <ProfileTabs />}
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
