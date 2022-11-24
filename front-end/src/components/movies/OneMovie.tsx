import { CardOverlay } from "../general/CardOverlay";
import movieImage from "../../images/denise-jans-Lq6rcifGjOU-unsplash.jpg";
import { tmdb_base_url } from "../../data/cloud_base_urls";

export interface BriefMovieProps {
  id: string;
  title: string;
  original_title: string;
  poster_path: string;
  release_date: string;
  homepage: string;
  ratings_count: number;
  ratings_average: number;
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
}: BriefMovieProps) => {
  const logo = poster_path
    ? `${tmdb_base_url}${poster_path}`
    : movieImage;
  return (
    <CardOverlay
      src={logo}
      fallbackSrc={movieImage}
      title={title || original_title}
      subtitle={release_date}
      href={`/movies/${id}`}
      width={100}
      height={200}
    />
  );
};
