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

export const addPrescriber = async (prescriber) => {
    const res = await callProtectedEndpoint(
        SERVER_PATHS.ADMIN_SERVICE.ADD_PRESCRIBER,
        'POST',
        {
            prescriber: prescriber
        }
    )
    if (res.status != 200) {
        const err = await res.json();
        console.log(err);
        return { data: null, error: err.error }
    }
    const result = await res.json()
    console.log(result);
    return { data: result.data, error: null }
}