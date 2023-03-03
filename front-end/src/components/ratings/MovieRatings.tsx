import { Grid, Rating, Stack, Tooltip, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { createRatingCall, updateRatingCall } from "../../api/ratings";
import { queriesKeys } from "../../api/queriesKeys";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectAuthUser } from "../../redux/slices/authSlice";
import { setSnackMessage } from "../../redux/slices/snackMessageSlice";

const labels: { [index: string]: string } = {
  0: "Bad",
  1: "Poor",
  2: "Poor+",
  3: "Ok",
  4: "Nice",
  5: "Amazing",
};

interface MovieRatingsProps {
  movieId: string;
  predicted_rating: number;
  existing_rating?: number;
  ratings_average: number;
  ratings_count: number;
  isSmall?: boolean;
  predicted_setting_up?: boolean;
}
export const MovieRatings = ({
  movieId,
  predicted_rating,
  existing_rating,
  ratings_average,
  ratings_count,
  isSmall = false,
  predicted_setting_up = false,
}: MovieRatingsProps) => {
  const dispatch = useAppDispatch();
  const { id: userId } = useAppSelector(selectAuthUser);
  const user_rating = existing_rating || predicted_rating;
  const [activeRating, setActiveRating] = useState<number | null>(user_rating);
  const queryClient = useQueryClient();

  useEffect(() => {
    setActiveRating(user_rating);
  }, [user_rating]);

  const refresh = () =>
    queryClient.invalidateQueries(queriesKeys["getUserExistingRatingsBrief"]);

  const createRating = (body: any) => {
    createRatingCall(body)
      .then((response) => {
        console.log(response.data);
        dispatch(
          setSnackMessage({
            text: "Rating submitted!",
            severity: "success",
          })
        );
        refresh();
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          setSnackMessage({
            text: "Sorry, we could not submit your rating",
            severity: "error",
          })
        );
      });
  };

  const updateRating = (body: any) => {
    updateRatingCall(body)
      .then((response) => {
        console.log(response.data);
        dispatch(
          setSnackMessage({
            text: "Rating submitted!",
            severity: "success",
          })
        );
        refresh();
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          setSnackMessage({
            text: "Sorry, we could not submit your rating",
            severity: "error",
          })
        );
      });
  };

  const onChange = (e: any, newValue: number | null) => {
    e.stopPropagation();
    const body = {
      userId,
      movieId: parseInt(movieId),
      rating: newValue,
    };
    if (existing_rating === undefined) {
      createRating(body);
    } else {
      updateRating(body);
    }
  };

  const onChangeActive = (e: any, newValue: number) => {
    setActiveRating(newValue);
  };

  const hasActiveRating = activeRating !== user_rating && activeRating !== -1;
  return (
    <Grid
      container
      spacing={isSmall ? 0 : 1}
      width={1}
      justifyContent={"space-between"}
      flexWrap="nowrap"
    >
      <Grid item>
        <Stack alignItems="center">
          <Typography variant="body2">
            {existing_rating || hasActiveRating ? "Your rating" : "Predicted"}
          </Typography>
          {hasActiveRating && (
            <Typography variant="body1" fontWeight="bold">
              {activeRating}
            </Typography>
          )}
          {!hasActiveRating && (
            <Typography variant="body1" fontWeight="bold">
              {user_rating}
            </Typography>
          )}
          {!hasActiveRating && !!user_rating && (
            <Rating
              precision={0.1}
              value={user_rating}
              size="small"
              onChange={onChange}
              onChangeActive={onChangeActive}
              onClick={(e) => e.stopPropagation()}
            />
          )}
          {!hasActiveRating && !user_rating && (
            <Typography variant="caption" align="center">
              Please wait, we are setting up your predictions
            </Typography>
          )}
          {hasActiveRating && (
            <Tooltip title={labels[Math.round(activeRating as number)]} arrow>
              <Rating
                precision={0.1}
                value={user_rating}
                size="small"
                onChange={onChange}
                onChangeActive={onChangeActive}
                onClick={(e) => e.stopPropagation()}
              />
            </Tooltip>
          )}
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
