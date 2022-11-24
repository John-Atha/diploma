import { Avatar, CardHeader, useTheme } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import { SecondaryEntityProps } from "./OneSecondaryEntity";

interface OneSecondaryEntityRowProps extends SecondaryEntityProps {
  entityName: string;
}

export const OneSecondaryEntityRow = ({
  id,
  name,
  movies_count,
  entityName,
}: OneSecondaryEntityRowProps) => {
  const theme = useTheme();
  return (
    <CardHeader
      component={NavLink}
      to={`/${entityName}/${name}`}
      sx={{ padding: 1, paddingLeft: 0, textDecoration: "none" }}
      avatar={
        <Avatar
          alt="avatar"
          sx={{ height: 30, width: 30, bgcolor: theme.palette.primary.main }}
        >
          {name.slice(0, 1)}
        </Avatar>
      }
      titleTypographyProps={{
        color: theme.palette.primary.main,
      }}
      title={name}
      subheader={`${movies_count} Movies`}
      // action={
      //     <Grid container alignItems="center" justifyContent={"flex-end"} sx={{ color: theme.palette.primary.main }}>
      //         <StarOutlined fontSize='small' />
      //         <Typography variant="body2">
      //             { stargazers_count || 0 }
      //         </Typography>
      //     </Grid>
      // }
    />
  );
};
