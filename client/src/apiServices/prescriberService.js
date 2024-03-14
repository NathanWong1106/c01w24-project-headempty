import { PrescriberPrescription } from "./types/prescriptionTypes";
import { callProtectedEndpoint } from "./utils/apiUtils"
import { SERVER_PATHS } from "./utils/constants"

/**
 * Gets a paginated list of prescribers
 * 
 * @param {number} page the page number
 * @param {number} pageSize the size of one page
 * @param {object} search search params (see server endpoint comment)
 * @returns {Array<PrescriberPrescription> | null} an array of prescriber info if successful, else null
 */
export const getPaginatedPrescriberPrescriptions = async (page, pageSize, search) => {
    const res = await callProtectedEndpoint(
        SERVER_PATHS.PRESCRIBER_SERVICE.GET_PAGINATED_PRESCRIPTIONS,
        'POST',
        {
            page: page,
            pageSize: pageSize,
            search: search
        }
    )

    return res.status != 200 ? null : (await res.json())['list'];
}