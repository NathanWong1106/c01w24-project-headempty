import { PrescriberInfo } from "./types/adminServiceTypes";
import { PatientPrescription, PrescriberPrescription } from "./types/prescriptionTypes";
import { callProtectedEndpoint } from "./utils/apiUtils"
import { SERVER_PATHS } from "./utils/constants"

/**
 * Gets a paginated list of prescribers
 * 
 * @param {number} page the page number
 * @param {number} pageSize the size of one page
 * @param {object} search search params (see server endpoint comment)
 * @returns {Array<PrescriberInfo> | null} an array of prescriber info if successful, else null
 */
export const getPaginatedPrescribers = async (page, pageSize, search) => {
    const res = await callProtectedEndpoint(
        SERVER_PATHS.ADMIN_SERVICE.GET_PAGINATED_PRESCRIBERS,
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
 * Patches a single prescriber specified by providerCode.
 * 
 * @param {*} providerCode the provider code of the prescriber
 * @param {*} patches patches (see server endpoint comment)
 * @returns {boolean} true on success, else false
 */
export const patchPrescriber = async (providerCode, patches) => {
    const res = await callProtectedEndpoint(
        SERVER_PATHS.ADMIN_SERVICE.PATCH_PRESCRIBER,
        'PATCH',
        {
            providerCode: providerCode,
            patches: patches
        }
    )

    return res.status == 200;
}

/**
 * Gets a paginated list of prescriber prescriptions
 * 
 * @param {number} page the page number
 * @param {number} pageSize the size of one page
 * @param {object} search search params (see server endpoint comment)
 * @returns {Array<PrescriberPrescription> | null} an array of prescription info if successful, else null
 */
export const getAdminPaginatedPrescriberPrescription = async (page, pageSize, search) => {
    const res = await callProtectedEndpoint(
        SERVER_PATHS.ADMIN_SERVICE.GET_PAGINATED_PRESCRIBER_PRESCRIPTION,
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
 * Patches a single prescriber prescription specified by providerCode, initial, and date.
 * 
 * @param {string} providerCode the provider code of the prescriber
 * @param {string} initial the initials of the patient
 * @param {string} date the date of the prescription
 * @param {object} patches patches (see server endpoint comment)
 * @returns {boolean} true on success, else false
 */
export const patchPrescriberPrescription = async (providerCode, initial, date, patches) => {
    const res = await callProtectedEndpoint(
        SERVER_PATHS.ADMIN_SERVICE.PATCH_SINGLE_PRESCRIBER_PRESCRIPTION,
        'PATCH',
        {
            providerCode: providerCode,
            initial: initial,
            date: date,
            patches: patches
        }
    )

    return res.status == 200;
}

/**
 * Deletes a single prescriber prescription specified by providerCode, initial, and date.
 * 
 * @param {object} search search params (see server endpoint comment)
 * @returns {boolean} true on success, else false
 */
export const deletePrescriberPrescription = async (search) => {
    const res = await callProtectedEndpoint(
        SERVER_PATHS.ADMIN_SERVICE.DELETE_PRESCRIBER_PRESCRIPTION,
        'POST',
        { search: search }
    )

    return res.status == 200;
}

/**
 * Gets a patient prescription
 * 
 * @param {object} search search params (see server endpoint comment)
 * @returns {PatientPrescription | null} a prescription info if successful, else null
 */
export const getAdminSinglePatientPrescription = async (search) => {
    const res = await callProtectedEndpoint(
        SERVER_PATHS.ADMIN_SERVICE.GET_SINGLE_PATIENT_PRESCRIPTION,
        'POST',
        { search: search }
    )

    return res.status != 200 ? null : (await res.json())['prescription'];
}

/**
 * Gets a prescriber prescription
 * 
 * @param {object} search search params (see server endpoint comment)
 * @returns {PrescriberPrescription | null} a prescription info if successful, else null
 */
export const getAdminSinglePrescriberPrescription = async (search) => {
    const res = await callProtectedEndpoint(
        SERVER_PATHS.ADMIN_SERVICE.GET_SINGLE_PRESCRIBER_PRESCRIPTION,
        'POST',
        { search: search }
    )

    return res.status != 200 ? null : (await res.json())['prescription'];
}