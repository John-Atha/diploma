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
import { useState } from "react";
import { stringSlice } from "../../helpers/stringSlice";
import { NavLink } from "react-router-dom";
import { MovieRatings } from "../ratings/MovieRatings";

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
  overview: string;
  existing_rating?: number;
  predicted_rating?: number;
  rating?: number;
  rating_datetime?: string;
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
  overview,
  existing_rating,
  predicted_rating,
  width = 250,
  rating,
  rating_datetime,
}: BriefMovieProps) => {
  const theme = useTheme();
  const logo = poster_path ? `${tmdb_base_url}${poster_path}` : movieImage;
  const [isFocused, setIsFocused] = useState(false);

  const renderCardContent = () => {
    return (
      <>
        <div>
          <Typography variant="body1">
            {stringSlice(title || original_title, 23)}
          </Typography>
          <Typography variant="caption">{release_date}</Typography>
        </div>
        {!isFocused && (
          <Grid container alignItems="center">
            <Rating
              precision={0.1}
              name="read-only"
              readOnly
              value={existing_rating || predicted_rating}
              size="small"
            />
            <Typography variant="body2">
              ({existing_rating || predicted_rating} / 5.0)
            </Typography>
          </Grid>
        )}

        {isFocused && (
          <MovieRatings
            movieId={id}
            predicted_rating={predicted_rating as number}
            existing_rating={existing_rating as number}
            ratings_average={ratings_average}
            ratings_count={ratings_count}
            isSmall
          />
        )}
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
      }}
      component={NavLink}
      to={`/movies/${id}`}
      onMouseOver={() => setIsFocused(true)}
      onMouseOut={() => setIsFocused(false)}
    >
      <CardMedia
        component="img"
        height={isFocused ? 150 : 210}
        image={logo}
        alt={title || original_title}
        sx={{
          bgcolor: theme.palette.background.paper,
        }}
      />
      <CardContent
        sx={{
          width: 1,
          borderRadius: 5,
          height: isFocused ? 150 : 90,
          padding: "8px !important",
          //   color: theme.palette.primary.light,
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
        component={Stack}
        spacing={1}
        justifyContent="flex-start"
      >
        {renderCardContent()}
      </CardContent>
    </Card>
  );
};
