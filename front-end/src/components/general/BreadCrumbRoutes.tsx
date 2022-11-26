import { NavigateNext } from "@mui/icons-material";
import { Breadcrumbs, Link } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { selectBreadCrumbRoutes } from "../../redux/slices/breadCrumbSlice";

export const BreadCrumb = () => {
  const { routes } = useAppSelector(selectBreadCrumbRoutes);
  return (
    <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
      {routes.map(({ text, href }) => (
        <Link
          underline="hover"
          key="text"
          color="inherit"
          component={NavLink}
          to={href}
        >
          {text}
        </Link>
      ))}
    </Breadcrumbs>
  );
};
