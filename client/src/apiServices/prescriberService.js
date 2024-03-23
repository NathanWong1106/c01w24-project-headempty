
import { initial } from "lodash";
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
export const getPaginatedPrescriberPrescriptions = async (page, pageSize, search) => {
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
  
  
  export const postPrescription = async (providerCode, patches) => {
    const res = await callProtectedEndpoint(
        SERVER_PATHS.PRESCRIBER_SERVICE.POST_PRESCRIPTION,
        'POST',
        {
            providerCode: providerCode,
            patches: patches
        }
    )
    return res.status == 200;
  }

  export const getMatchingPrescriberPrescription = async (providerCode, date, initial) => {
    const res = await callProtectedEndpoint(
        SERVER_PATHS.PRESCRIBER_SERVICE.GET_MATCHING_PRESCRIPTION,
        'POST',
        {
            providerCode: providerCode,
            date: date,
            initial: initial
        }
    )
    return res.status != 200 ? null : (await res.json());

  }

  export const patchPatientPrescriptionStatus = async (id, patStatus) => {
    const res = await callProtectedEndpoint(
        SERVER_PATHS.PRESCRIBER_SERVICE.PATCH_PATIENT_STATUS,
        'PATCH',
        {
            id: id,
            patStatus: patStatus
        }
    )
    return res.status == 200;
  }
