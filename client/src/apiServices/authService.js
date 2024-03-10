import { createAsyncThunk } from "@reduxjs/toolkit";
import { callEndpoint } from "./utils/apiUtils";
import { SERVER_PATHS } from "./utils/constants";

// For more on redux thunks:
// https://redux-toolkit.js.org/api/createAsyncThunk
// and async logic in redux
// https://redux.js.org/tutorials/essentials/part-5-async-logic#reducers-and-loading-actions

/**
 * Attempts to log the user in returns a user object if successful, else null.
 * @param {string} email 
 * @param {string} password 
 * @returns a user object if successful, else null.
 */
export const loginUser = createAsyncThunk(
    '/auth/login',
    async ({ email, password, accountType }, thunkAPI) => {
        try {
            const res = await callEndpoint(SERVER_PATHS.LOGIN, 'POST', { email, password, accountType })
            
            if (res.status != 200) {
                return thunkAPI.rejectWithValue(await res.json());
            }
            return await res.json();
        } catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
)