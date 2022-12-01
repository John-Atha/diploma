import { CardMedia, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import { tmdb_base_url } from "../../data/cloud_base_urls";
import { useMovieData } from "../../hooks/useMovieData";
import movieImage from "../../images/denise-jans-Lq6rcifGjOU-unsplash.jpg";
import { CarouselResults } from "../general/CarouselResults";
import { OnePerson, placeholderPerson } from "../people/OnePerson";
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
  const { fields, neighbours } = useMovieData(data);
  const {
    title,
    original_title,
    poster_path,
    tagline,
    overview,
    release_date,
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
        <Grid item width={400}>
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
          <Stack spacing={1}>
            <Grid container width={1} spacing={1}>
              <Grid item xs>
                <MovieRelatives
                  title="Genres"
                  data={(neighbours as any)["Genre"]}
                />
              </Grid>
              <Grid item xs>
                <MovieRelatives
                  title="Keywords"
                  data={(neighbours as any)["Keyword"]}
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={1}
              width={1}
              marginLeft={"-8px !important"}
            >
              <Grid item xs>
                <Stack spacing={1}>
                  <MovieRelatives
                    title="Language"
                    data={(neighbours as any)["Language"]}
                  />
                  <MovieRelatives
                    title="Production Countries"
                    data={(neighbours as any)["ProductionCountry"]}
                  />
                </Stack>
              </Grid>
              <Grid item xs>
                <MovieRelatives
                  title="Production Companies"
                  data={(neighbours as any)["ProductionCompany"]}
                />
              </Grid>
            </Grid>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
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
    </Stack>
  );
};
