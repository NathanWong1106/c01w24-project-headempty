import { callProtectedEndpoint } from "./utils/apiUtils"
import { SERVER_PATHS } from "./utils/constants"

export const getPrescriberStatuses = async (prescriberData) => {
    const res = await callProtectedEndpoint(
        SERVER_PATHS.VERIFY_PRESCRIBERS,
        'POST',
        {
            prescribers: prescriberData,
        }
    )

    return res.status == 200 ? await res.json() : null;
}