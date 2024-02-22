import { createSlice } from "@reduxjs/toolkit";

export const currentUserSlice = createSlice({
    name: 'currentUser',
    initialState: {
        loggedIn: false,
        userType: null,
        email: "",
        hashedPW: "",
        token: ""
    },
    reducers: {
        login: state => {
            state.loggedIn = true;
        }
    }
})

export const { login } = currentUserSlice.actions;

export default currentUserSlice.reducer;