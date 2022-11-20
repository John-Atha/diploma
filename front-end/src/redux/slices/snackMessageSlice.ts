import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface SnackProps {
    text: string | null,
    severity: "info" | "success" | "error" | "warning",
    duration?: number,
}

const initialState: SnackProps = {
    text: "",
    severity: "info",
    duration: 6000,
}

export const snackMessageSlice = createSlice({
    name: "snackMessage",
    initialState,
    reducers: {
        setSnackMessage: (state, action: PayloadAction<SnackProps>) => {
            const { text, severity, duration } = action.payload;
            state.text = text;
            state.severity = severity || "info";
            state.duration = duration || 6000;
        },
        closeSnackMessage: (state) => {
            state.text = null; 
        }
    }
});

export const { setSnackMessage, closeSnackMessage } = snackMessageSlice.actions;
export const selectSnackMessage = (state: RootState) => state.snackMessage;
export default snackMessageSlice.reducer;
