import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
    routes: [],
}

export const breadCrumbSlice = createSlice({
    name: "breadCrumbRoutes",
    initialState,
    reducers: {
        setRoutes: (state, action) => {
            const { routes } = action.payload;
            state.routes = routes;
        },
    }
});

export const { setRoutes } = breadCrumbSlice.actions;
export const selectBreadCrumbRoutes = (state: RootState) => state.breadCrumbRoutes;
export default breadCrumbSlice.reducer;