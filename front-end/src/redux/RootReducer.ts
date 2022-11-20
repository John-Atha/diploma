import { combineReducers } from "@reduxjs/toolkit";
import dialogSlice from "./slices/dialogSlice";
import searchUser from "./slices/searchUser";
import snackMessageSlice from "./slices/snackMessageSlice";

const RootReducer = combineReducers({
    dialog: dialogSlice,
    snackMessage: snackMessageSlice,
    searchUser: searchUser,
})

export default RootReducer;
