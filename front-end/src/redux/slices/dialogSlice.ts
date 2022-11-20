import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
    content: null,
}

export const dialogSlice = createSlice({
    name: "dialog",
    initialState,
    reducers: {
        setDialog: (state, action) => {
            const { content } = action.payload;
            state.content = content;
        },
        closeDialog: (state) => {
            state.content = null;
        }
    }
});

export const { setDialog, closeDialog } = dialogSlice.actions;
export const selectDialog = (state: RootState) => state.dialog;
export default dialogSlice.reducer;