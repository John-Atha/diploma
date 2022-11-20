import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface SearchUserProps {
    user: any,
}

const initialState: SearchUserProps = {
    user: null,
}

export const searchUserSlice = createSlice({
    name: "searchUser",
    initialState,
    reducers: {
        setSearchUser: (state, action: PayloadAction<SearchUserProps>) => {
            const { user } = action.payload;
            state.user = user;
        },
        clearSearchUser: (state) => {
            state.user = null; 
        }
    }
});

export const { setSearchUser, clearSearchUser } = searchUserSlice.actions;
export const selectSearchUser = (state: RootState) => state.searchUser;
export default searchUserSlice.reducer;
