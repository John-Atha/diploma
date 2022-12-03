import movieImage from "../../images/denise-jans-Lq6rcifGjOU-unsplash.jpg";
import { tmdb_base_url } from "../../data/cloud_base_urls";
import {
  alpha,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Rating,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { stringSlice } from "../../helpers/stringSlice";

export interface BriefMovieProps {
  id: string;
  title: string;
  original_title: string;
  poster_path: string;
  release_date: string;
  homepage: string;
  ratings_count: number;
  ratings_average: number;
  width?: number | string;
}

export const MovieCard = ({
  id,
  title,
  original_title,
  poster_path,
  release_date,
  homepage,
  ratings_count,
  ratings_average,
  width = 250,
}: BriefMovieProps) => {
  const theme = useTheme();
  const logo = poster_path ? `${tmdb_base_url}${poster_path}` : movieImage;
  const [isFocused, setIsFocused] = useState(false);

  const renderCardContent = () => {
    return (
      <>
        <Typography variant="body1">{stringSlice(title || original_title, 25)}</Typography>
        <Typography variant="caption">{release_date}</Typography>
        <Grid container alignItems="center">
          <Rating name="read-only" value={ratings_average} size="small" />
          <Typography variant="body2">
            ({ratings_count})
          </Typography>
        </Grid>
      </>
    );
  };

  return (
    <Card
      sx={{
        height: 300,
        // width,
        borderRadius: 7,
        position: "relative",
        textDecoration: "none",
        bgcolor: theme.palette.background.paper,
      }}
      //   component={NavLink}
      //   to={`/movies/${id}`}
    >
      <CardMedia
        component="img"
        height={isFocused ? 100 : 200}
        image={logo}
        alt={title || original_title}
      />
      <CardContent
        sx={{
          width: 1,
          borderRadius: 5,
          height: isFocused ? 200 : 100,
          padding: "8px !important",
          //   color: theme.palette.primary.light,
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
        component={Stack}
        justifyContent="flex-start"
        onMouseOver={() => setIsFocused(true)}
        onMouseOut={() => setIsFocused(false)}
      >
        {renderCardContent()}
      </CardContent>
    </Card>
  );
};
