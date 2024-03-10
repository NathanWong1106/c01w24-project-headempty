import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "../../apiServices/authService";
import { setAPIToken } from "../../apiServices/utils/apiUtils";

export const currentUserSlice = createSlice({
    name: 'currentUser',
    initialState: {
        // Common info for all users
        loggedIn: false,
        accountType: "",
        email: "",
        token: "",

        // User specific information (e.g. provider code)
        auxInfo: {},
    },
    reducers: {
        logoutUser(state, action) {
            state.loggedIn = false;
            state.accountType = "";
            state.email = "";
            state.token = "";
            state.auxInfo = {};
        }
    },

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

                setAPIToken (action.payload.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                setAPIToken ("");
            })
    }
})

export const { logoutUser } = currentUserSlice.actions;

export default currentUserSlice.reducer;