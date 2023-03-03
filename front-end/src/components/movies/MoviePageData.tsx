import { CardMedia, Grid, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { tmdb_base_url } from "../../data/cloud_base_urls";
import { useMovieData } from "../../hooks/useMovieData";
import movieImage from "../../images/denise-jans-Lq6rcifGjOU-unsplash.jpg";
import { useAppSelector } from "../../redux/hooks";
import { selectRatings } from "../../redux/slices/ratingsSlice";
import { CarouselResults } from "../general/CarouselResults";
import { GraphVisual } from "../graphVisualization/GraphVisual";
import { OnePerson, placeholderPerson } from "../people/OnePerson";
import { MovieRatings } from "../ratings/MovieRatings";
import { MovieRelatives } from "./MovieRelatives";

interface Neighbour {
  nodeType: string;
  [key: string]: number | string;
}

interface MovieData {
  data: {
    fields: {
      [key: string]: number | string;
    };
    neighbours: Neighbour[];
  };
}

export const MoviePageData = ({ data }: MovieData) => {
  const { predictedRatings, existingRatings } = useAppSelector(selectRatings);
  const { fields, neighbours } = useMovieData(data);
  const {
    id,
    title,
    original_title,
    poster_path,
    tagline,
    overview,
    release_date,
    ratings_average,
    ratings_count,
  } = fields;
  const logo = poster_path ? `${tmdb_base_url}${poster_path}` : movieImage;
  console.log({ neighbours });

  return (
    <Stack spacing={2}>
      <div style={{ paddingLeft: 16 }}>
        <Typography variant="h5">{title || original_title}</Typography>
        <Typography variant="body2">{release_date}</Typography>
      </div>
      <Grid container spacing={2}>
        <Grid item md={5} xs={12}>
          <Stack spacing={2}>
            <CardMedia
              component="img"
              height={300}
              image={logo}
              alt={""}
              sx={{
                borderRadius: 5,
                backgroundImage:
                  "linear-gradient(to top, rgba(0, 0, 0, 1), transparent)",
                width: 1,
              }}
            />
            {!!tagline && <Typography variant="body1">{tagline}</Typography>}
            <Typography variant="body2">{overview}</Typography>
          </Stack>
        </Grid>
        <Grid item xs>
          <Grid container spacing={1}>
            <Grid item md={6}>
              <Paper sx={{ padding: 1, height: 1 }}>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{ marginBottom: 1 }}
                >
                  Ratings
                </Typography>
                <MovieRatings
                  movieId={id}
                  ratings_average={ratings_average}
                  ratings_count={ratings_count}
                  predicted_rating={predictedRatings?.[id] || 0}
                  existing_rating={existingRatings?.[id]}
                  predicted_setting_up={Object.keys(predictedRatings).length === 0}
                />
              </Paper>
            </Grid>
            <Grid item md={6}>
              <MovieRelatives
                title="Genres"
                data={(neighbours as any)["Genre"]}
                keyField="name"
                entityName="Genres"
              />
            </Grid>
            <Grid item md={6}>
              <MovieRelatives
                title="Keywords"
                data={(neighbours as any)["Keyword"]}
                keyField="name"
                entityName="Keywords"
              />
            </Grid>
            <Grid item md={6}>
              <MovieRelatives
                title="Production Companies"
                data={(neighbours as any)["ProductionCompany"]}
                keyField="name"
                entityName="ProductionCompanies"
              />
            </Grid>
            <Grid item md={6}>
              <MovieRelatives
                title="Language"
                data={(neighbours as any)["Language"]}
                keyField="iso_639_1"
                entityName="Languages"
              />
            </Grid>
            <Grid item md={6}>
              <MovieRelatives
                title="Production Countries"
                data={(neighbours as any)["ProductionCountry"]}
                keyField="iso_3166_1"
                entityName="ProductionCountries"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {!!neighbours["Cast"]?.length && (
              <Grid item md={6} xs={12}>
                <CarouselResults
                  data={neighbours["Cast"]}
                  isLoading={false}
                  title="Cast"
                  width={"100%"}
                  // maxWidth="900px"
                  oneResultComponent={<OnePerson {...placeholderPerson} />}
                  isSmallList
                />
              </Grid>
            )}
            <Grid item md={6} xs={12}>
              <CarouselResults
                data={neighbours["Crew"]}
                isLoading={false}
                title="Crew"
                width={"100%"}
                // maxWidth="900px"
                oneResultComponent={<OnePerson {...placeholderPerson} />}
                isSmallList
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Typography variant="h6">Visualization</Typography>
      <GraphVisual
        // width={bounds.width}
        entityName="movies"
        keyValue={id}
        nodeLabel={title || original_title}
        centralNode={data.fields}
        centralNodeIsMovie
        data={neighbours}
        isLoading={false}
        isError={false}
      />
    </Stack>
  );
};
