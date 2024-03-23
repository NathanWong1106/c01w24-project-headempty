import { PatientInfo } from "./types/adminServiceTypes";
import { callProtectedEndpoint } from "./utils/apiUtils"
import { SERVER_PATHS } from "./utils/constants"

/**
 * Gets a paginated list of patients
 * 
 * @param {number} page the page number
 * @param {number} pageSize the size of one page
 * @param {object} search search params (see server endpoint comment)
 * @returns {Array<PatientInfo> | null} an array of patient info if successful, else null
 */
export const getPaginatedPatients = async (page, pageSize, search) => {
    const res = await callProtectedEndpoint(
        SERVER_PATHS.COORDINATOR_SERVICE.GET_PAGINATED_PATIENTS,
        'POST',
        {
            page: page,
            pageSize: pageSize,
            search: search
        }
    )

    return res.status != 200 ? null : (await res.json())['list'];
}

/**
 * Patches a single patient specified by email.
 * 
 * @param {*} email the email of the patient
 * @param {*} patches patches (see server endpoint comment)
 * @returns {boolean} true on success, else false
 */
export const patchPatient = async (email, patches) => {
    const res = await callProtectedEndpoint(
        SERVER_PATHS.COORDINATOR_SERVICE.PATCH_PATIENT,
        'PATCH',
        {
            email: email,
            patches: patches
        }
    )

    return res.status == 200;
}