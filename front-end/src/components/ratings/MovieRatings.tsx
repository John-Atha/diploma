import { Grid, Rating, Stack, Typography } from "@mui/material";
import React from "react";

interface MovieRatingsProps {
  predicted_rating: number;
  existing_rating?: number;
  ratings_average: number;
  ratings_count: number;
  isSmall?: boolean;
}
export const MovieRatings = ({
  predicted_rating,
  existing_rating,
  ratings_average,
  ratings_count,
  isSmall = false,
}: MovieRatingsProps) => {
  const user_rating = existing_rating || predicted_rating;
  return (
    <Grid container spacing={isSmall ? 0 : 1} justifyContent={"space-between"}>
      <Grid item>
        <Stack alignItems="center">
          <Typography variant="body2">{existing_rating ? "Your rating" : "Predicted"}</Typography>
          <Typography variant="body1" fontWeight="bold">
            {user_rating}
          </Typography>
          <Rating
            precision={0.1}
            value={user_rating}
            size="small"
          />
        </Stack>
      </Grid>
      <Grid item>
        <Stack alignItems="center">
          <Typography variant="body2">Average</Typography>
          <Typography variant="body1">
            <b>{ratings_average.toFixed(1)}</b> ({ratings_count})
          </Typography>
          {/* <Grid container alignItems="center"> */}
          <Rating
            precision={0.1}
            readOnly
            value={parseFloat(ratings_average.toFixed(1))}
            size="small"
          />
          {/* <Typography variant="body2">({ratings_count})</Typography> */}
          {/* </Grid> */}
        </Stack>
      </Grid>
    </Grid>
  );
};
