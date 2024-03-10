import { createAsyncThunk } from "@reduxjs/toolkit";
import { callEndpoint } from "./utils/apiUtils";
import { SERVER_PATHS } from "./utils/constants";

export const registerPrescriber = createAsyncThunk(
    '/registration/prescriber',
    async ({ _id, password, language }, thunkAPI) => {
        try {
            const res = await callEndpoint(SERVER_PATHS.PRESCRIBER_REGISTRATION + "/prescriber", 'PATCH', { _id, password, language })

            if (res.status != 200) {
                return thunkAPI.rejectWithValue(await res.json());
            }
            return await res.json();
        } catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
)