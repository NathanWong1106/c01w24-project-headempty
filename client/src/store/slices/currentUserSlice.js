import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "../../apiServices/authService";

export const currentUserSlice = createSlice({
    name: 'currentUser',
    initialState: {
        // Common info for all users
        loggedIn: false,
        accountType: "",
        email: "",
        token: "",

        // User specific information (e.g. provider code)
        auxInfo: {}
    },
    reducers: {},

    // For more context visit:
    // https://blog.logrocket.com/handling-user-authentication-redux-toolkit/#handling-asynchronous-functions-extrareducers
    extraReducers(builder) {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loggedIn = true;
                state.accountType = action.payload.accountType;
                state.token = action.payload.token;
                state.email = action.payload.email;

                state.auxInfo = action.payload;

            })
            .addCase(loginUser.rejected, (state, action) => {
                console.log(action.error);
            })
    }
})

export default currentUserSlice.reducer;