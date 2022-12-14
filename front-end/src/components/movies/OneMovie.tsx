import { CardOverlay } from "../general/CardOverlay";
import movieImage from "../../images/denise-jans-Lq6rcifGjOU-unsplash.jpg";
import { tmdb_base_url } from "../../data/cloud_base_urls";
import { Grid, Rating, Typography } from "@mui/material";

export interface BriefMovieProps {
  id: string;
  title: string;
  original_title: string;
  poster_path: string;
  release_date: string;
  homepage: string;
  ratings_count: number;
  ratings_average: number;
  width?: number;
  overview: string;
}

export const placeholderMovie = {
  id: "0",
  title: "",
  original_title: "",
  poster_path: "",
  release_date: "",
  homepage: "",
  ratings_count: 0,
  ratings_average: 0,
  overview: "",
};

export const OneMovie = ({
  id,
  title,
  original_title,
  poster_path,
  release_date,
  homepage,
  ratings_count,
  ratings_average,
  width = 100,
}: BriefMovieProps) => {
  const logo = poster_path ? `${tmdb_base_url}${poster_path}` : movieImage;

  return (
    <CardOverlay
      src={logo}
      fallbackSrc={movieImage}
      title={title || original_title}
      subtitle={
        <Grid container alignItems="center">
          <Rating
            precision={0.5}
            name="read-only"
            value={ratings_average}
            size="small"
            readOnly
          />
          <Typography variant="body2">
            {ratings_average.toFixed(2)} ({ratings_count})
          </Typography>
        </Grid>
      }
      href={`/movies/${id}`}
      width={width}
      height={200}
    />
  );
};
