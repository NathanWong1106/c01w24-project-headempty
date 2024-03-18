import { createAsyncThunk } from "@reduxjs/toolkit";
import { callEndpoint } from "./utils/apiUtils";
import { SERVER_PATHS } from "./utils/constants";

export const registerUser = async ({ email, password, accountType, fName, lName, initials, address, city, province, preferredLanguage }) => {
    try {
        const res = await callEndpoint(SERVER_PATHS.PATIENT_REGISTRATION, 'POST', { email, password, accountType, fName, lName, initials, address, city, province, preferredLanguage })

        if (res.status != 200) {
            const err = await res.json();
            return { data: null, error: err }
        }
        const result = await res.json()
        return { data: result, error: null }
    } catch (err) {
        return { data: null, error: err }
    }
}