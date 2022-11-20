import { GroupOutlined } from "@mui/icons-material";
import { Grid, useTheme } from "@mui/material";
import React, { ReactElement, useEffect } from "react";
import { useQuery } from "react-query";
import { getSummary } from "../../api/general";
import { queriesKeys } from "../../api/queriesKeys";
import { SimpleCard } from "../general/SimpleCard";
import MovieIcon from "@mui/icons-material/Movie";
import ClassIcon from "@mui/icons-material/Class";
import NavigationIcon from "@mui/icons-material/Navigation";

interface Config {
    subtitle: string;
    color: "success" | "info" | "warning" | "error",
    icon: ReactElement,
    href: string;

}
interface Configs {
    [key: string]: Config,
}

const configs: Configs = {
  Movie: {
    subtitle: "Movies",
    color: "success",
    icon: <MovieIcon />,
    href: "/movies",
  },
  Genre: {
    subtitle: "Genres",
    color: "info",
    icon: <ClassIcon />,
    href: "/genres",
  },
  Person: {
    subtitle: "People",
    color: "warning",
    icon: <GroupOutlined />,
    href: "/people",
  },
  Keyword: {
    subtitle: "Keywords",
    color: "error",
    icon: <NavigationIcon />,
    href: "/keywords",
  },
};

export const Summary = () => {
  const theme = useTheme();
  const { data, isLoading } = useQuery(
    queriesKeys["getSummary"],
    () => getSummary(),
    {
      refetchOnWindowFocus: false,
      cacheTime: 0,
    }
  );

  if (!data) return null;

  return (
    <Grid container spacing={1} justifyContent="center">
      {Object.entries(data || {}).map(([key, value]) => {
        if (!configs[key]) return null;
        const { subtitle, icon, href, color } = configs[key];
        return (
          <Grid item key={subtitle}>
            <SimpleCard
              subtitle={subtitle}
              title={`${value}` || "0"}
              icon={React.cloneElement(icon, { htmlColor: theme.palette[color].main })}
              severity={color}
              href={href}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};
