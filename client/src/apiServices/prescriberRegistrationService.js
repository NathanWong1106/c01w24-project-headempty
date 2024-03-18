import { callEndpoint } from "./utils/apiUtils";
import { SERVER_PATHS } from "./utils/constants";

export const registerPrescriber = async ({ _id, email, password, language }) => {
        try {
            return await callEndpoint(SERVER_PATHS.PRESCRIBER_REGISTRATION + "/prescriber", 'PATCH', { _id, email, password, language });
        } catch (err) {
            return err;
        }
    }
    