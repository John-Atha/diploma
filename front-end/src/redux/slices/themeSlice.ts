import { blue, green, purple, red, yellow } from "@mui/material/colors";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
  primary__main: red,
  primary__options: [red, green, yellow, blue, purple],
  mode: "dark",
  mode_options: ["light", "dark"],
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      const { primary__main, mode } = action.payload;
      state.primary__main = primary__main;
      state.mode = mode;
    },
    restore: (state) => {
      state.primary__main = red;
      state.mode = "dark";
    },
  },
});

export const { setTheme, restore } = themeSlice.actions;
export const selectTheme = (state: RootState) => state.theme;
export default themeSlice.reducer;
