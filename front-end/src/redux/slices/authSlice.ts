import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
  token: "",
  username: "",
  id: 0,
};

export const authSlice = createSlice({
  name: "authUser",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      const { token, username, id } = action.payload;
      state.token = token;
      state.username = username;
      state.id = id;
    },
    logout_: (state) => {
      state.token = "";
      state.username = "";
      state.id = 0;
    },
  },
});

export const { setAuthUser, logout_ } = authSlice.actions;
export const selectAuthUser = (state: RootState) => state.authUser;
export default authSlice.reducer;
