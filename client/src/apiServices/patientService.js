import { PatientPrescription } from "./types/prescriptionTypes";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { callProtectedEndpoint, callEndpoint } from "./utils/apiUtils"
import { SERVER_PATHS } from "./utils/constants"

/**
 * Gets a paginated list of prescriber prescriptions
 * 
 * @param {number} page the page number
 * @param {number} pageSize the size of one page
 * @param {object} search search params (see server endpoint comment)
 * @returns {Array<PatientPrescription> | null} an array of prescription info if successful, else null
 */
export const getPaginatedPatientPrescriptions = async (page, pageSize, search) => {
    const res = await callProtectedEndpoint(
        SERVER_PATHS.PATIENT_SERVICE.GET_PAGINATED_PRESCRIPTIONS,
        'POST',
        {
            page: page,
            pageSize: pageSize,
            search: search
        }
    )

    return res.status != 200 ? null : (await res.json())['list'];
}

export const postPatientPrescription = async (providerCode, prscn_date, patientInit, checked, postObj) => {
    const res = await callProtectedEndpoint(
        SERVER_PATHS.PATIENT_SERVICE.POST_PRESCRIPTION,
        'POST',
        {
            providerCode: providerCode,
            prscn_date: prscn_date,
            patientInit: patientInit,
            checked: checked,
            postObj: postObj
        
        }
    )
    return res.status == 200;
}

/**
 * Patches a single patient's address specified by email.
 * 
 * @param {*} email the email of the patient
 * @param {*} address updated address
 * @param {*} city updated city
 * @param {*} province updated province
 * @returns {object} document of updates patient
 */
export const patchAddress = createAsyncThunk(
    '/patient/address',
    async(input, thunkAPI) => {
        try {
            const { email, address, city, province } = input;
            const res = await callProtectedEndpoint(SERVER_PATHS.PATIENT_SERVICE.PATCH_ADDRESS, 'PATCH', { email, address, city, province })
            if (res.status != 200) {
                return thunkAPI.rejectWithValue(await res.json());
            }
            const output = await res.json()
            return output;
        } catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
)

/*
export const patchAddress = async (email, patches) => {
    const res = await callProtectedEndpoint(
        SERVER_PATHS.PATIENT_SERVICE.PATCH_ADDRESS,
        'PATCH',
        {
            email: email,
            patches: patches
        }
    )
    return await res.json();
}
*/