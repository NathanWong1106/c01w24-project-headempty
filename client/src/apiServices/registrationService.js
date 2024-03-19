import { callEndpoint } from "./utils/apiUtils";
import { SERVER_PATHS } from "./utils/constants";

export const registerPatient = async ({ email, password, accountType, fName, lName, initials, address, city, province, preferredLanguage }) => {
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


export const registerPrescriber = async ({ _id, email, password, language }) => {
    try {
        return await callEndpoint(SERVER_PATHS.PRESCRIBER_REGISTRATION + "/prescriber", 'PATCH', { _id, email, password, language });
    } catch (err) {
        return err;
    }
}
    