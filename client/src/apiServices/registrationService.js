import { createAsyncThunk } from "@reduxjs/toolkit";
import { callEndpoint } from "./utils/apiUtils";
import { SERVER_PATHS } from "./utils/constants";

// For more on redux thunks:
// https://redux-toolkit.js.org/api/createAsyncThunk
// and async logic in redux
// https://redux.js.org/tutorials/essentials/part-5-async-logic#reducers-and-loading-actions


export const registerUser = createAsyncThunk(
    '/user/register',
    async ({ email, password, accountType, fName, lName, initials, address, city, province, preferredLanguage }, thunkAPI) => {
        try {
            const res = await callEndpoint(SERVER_PATHS.REGISTRATION, 'POST', { email, password, accountType, fName, lName, initials, address, city, province, preferredLanguage })

            if (res.status != 200) {
                return thunkAPI.rejectWithValue(await res.json());
            }
            return await res.json();
        } catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
)