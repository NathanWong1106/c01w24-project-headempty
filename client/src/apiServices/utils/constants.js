export const SERVER_ADDRESS = process.env.REACT_APP_API_ADDRESS;

export const SERVER_PATHS = {
    LOGIN: "/user/login",
    ADMIN_SERVICE: {
        GET_PAGINATED_PRESCRIBERS: "/admin/getPaginatedPrescribers",
        PATCH_PRESCRIBER: "/admin/patchPrescriber"
    },
    PRESCRIBER_SERVICE: {
        GET_PRESCRIPTIONS: "/prescriber/getPrescriptions",
        POST_PRESCRIPTION: "/prescriber/postPrescription"
    }
}