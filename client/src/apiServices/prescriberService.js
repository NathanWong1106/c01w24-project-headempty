import { PrescriptionInfo } from "./types/prescriberServiceTypes";
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
export const getPrescriptions = async (page, pageSize, prescriberLiscneceNo) => {
    const res = await callProtectedEndpoint(
        SERVER_PATHS.PRESCRIBER_SERVICE.GET_PRESCRIPTIONS,
        'GET',
        {
            page: page,
            pageSize: pageSize,
            prescriberLiscneceNo: prescriberLiscneceNo
        }
    )

    return res.status != 200 ? null : (await res.json())['list'];
}

export const postPrescription = async (providerCode, patientInitials, date, patches) => {
    const res = await callProtectedEndpoint(
        SERVER_PATHS.PRESCRIBER_SERVICE.POST_PRESCRIPTION,
        'POST',
        {
            providerCode: providerCode,
            patientInitials: patientInitials,
            date: date,
            patches: patches
        }
    )

    return res.status == 200;
}