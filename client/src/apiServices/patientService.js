import { PatientPrescription } from "./types/prescriptionTypes";
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

export const patchSinglePatientPrescription = async (id, pat_status) => {
    const res = await callProtectedEndpoint(
        SERVER_PATHS.PATIENT_SERVICE.PATCH_SINGLE_PRESCRIPTION,
        'PATCH',
        {
            id: id,
            pat_status: pat_status
        }
    )
    return res.status == 200;

}

export const getMatchingPatientPrescription = async (providerCode, date, initial) => {
    const res = await callEndpoint(
        SERVER_PATHS.PATIENT_SERVICE.GET_MATCHING_PRESCRIPTION,
        'POST',
        {
            providerCode: providerCode,
            date: date,
            initial: initial
        }
    )
    return res;
}