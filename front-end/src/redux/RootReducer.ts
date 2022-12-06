import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import breadCrumbSlice from "./slices/breadCrumbSlice";
import dialogSlice from "./slices/dialogSlice";
import searchUser from "./slices/searchUser";
import snackMessageSlice from "./slices/snackMessageSlice";
import themeSlice from "./slices/themeSlice";

const RootReducer = combineReducers({
  dialog: dialogSlice,
  snackMessage: snackMessageSlice,
  searchUser: searchUser,
  breadCrumbRoutes: breadCrumbSlice,
  authUser: authSlice,
  theme: themeSlice,
});

export default RootReducer;
