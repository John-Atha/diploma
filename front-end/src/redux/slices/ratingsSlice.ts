import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
  predictedRatings: [],
  existingRatings: [],
};

export const ratingsSlice = createSlice({
  name: "ratings",
  initialState,
  reducers: {
    setPredictedRatings: (state, action) => {
      const { predictedRatings } = action.payload;
      state.predictedRatings = predictedRatings;
    },
    setExistingRatings: (state, action) => {
      const { existingRatings } = action.payload;
      state.existingRatings = existingRatings;
    },
  },
});

export const { setPredictedRatings, setExistingRatings } = ratingsSlice.actions;
export const selectRatings = (state: RootState) => state.ratings;
export default ratingsSlice.reducer;
