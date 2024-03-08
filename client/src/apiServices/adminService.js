import { PrescriberInfo } from "./types/adminServiceTypes";
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