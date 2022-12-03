import React, { useEffect, useState } from "react";
import { Avatar, Button, Chip, Grid, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { tmdb_base_url } from "../../data/cloud_base_urls";
import movieImage from "../../images/denise-jans-Lq6rcifGjOU-unsplash.jpg";

interface SearchResultProps {
  datum: any;
  entityName: string;
}

interface SearchDatum {
  title: string;
  subtitle: string;
  href: string;
  tag: string;
  src?: string;
}

export const SearchResult = ({ datum, entityName }: SearchResultProps) => {
  const [item, setItem] = useState({
    title: "",
    subtitle: "",
    href: "#",
    tag: "",
    src: "",
  });

  useEffect(() => {
    if (!datum) return;
    switch (entityName) {
      case "Movies":
        setItem({
          title: datum.title || datum.original_title,
          subtitle: datum.release_date,
          href: `/movies/${datum.id}`,
          tag: "Movie",
          src: datum.poster_path
            ? `${tmdb_base_url}${datum.poster_path}`
            : movieImage,
        });
        break;
      case "Genres":
        setItem({
          title: datum.name,
          subtitle: "",
          href: `/genres/${datum.name}`,
          tag: "Genre",
          src: "",
        });
        break;
      case "Keywords":
        setItem({
          title: datum.name,
          subtitle: "",
          href: `/keywords/${datum.name}`,
          tag: "Keyword",
          src: "",
        });
        break;
      case "People":
        setItem({
          title: datum.name,
          subtitle: "",
          href: `/people/${datum.id}`,
          tag: "Person",
          src: `${tmdb_base_url}${datum.profile_path}`,
        });
        break;
      case "ProductionCountries":
        setItem({
          title: datum.name,
          subtitle: "",
          href: `/productioncountries/${datum.iso_3166_1}`,
          tag: "ProductionCountry",
          src: "",
        });
        break;
      case "ProductionCompanies":
        setItem({
          title: datum.name,
          subtitle: "",
          href: `/productioncompanies/${datum.name}`,
          tag: "ProductionCompany",
          src: "",
        });
        break;
      case "Languages":
        setItem({
          title: datum.name,
          subtitle: "",
          href: `/languages/${datum.iso_639_1}`,
          tag: "Language",
          src: "",
        });
        break;
    }
  }, [datum, entityName]);

  return (
    <Grid
      container
      alignItems="center"
      spacing={1}
      marginLeft={"0px !important"}
      component={NavLink}
      to={item.href}
      sx={{ textDecoration: "none", color: "inherit", width: "inherit" }}
    >
      <Grid item>
        {!!item.src && <Avatar src={item.src} alt={item.title} />}
        {!item.src && <Avatar>{item.title.slice(0, 1)}</Avatar>}
      </Grid>
      <Grid item xs={6}>
        <Typography variant="body2">{item.title}</Typography>
        <Typography variant="caption">{item.subtitle}</Typography>
      </Grid>
      <Grid item xs>
        <NavLink color="info" to={item.href}>
          Explore
        </NavLink>
      </Grid>
    </Grid>
  );
};
