export const SERVER_ADDRESS = process.env.REACT_APP_API_ADDRESS;

export const SERVER_PATHS = {
    LOGIN: "/user/login",
    REGISTRATION: "/user/register",
    ADMIN_SERVICE: {
        GET_PAGINATED_PRESCRIBERS: "/admin/getPaginatedPrescribers",
        PATCH_PRESCRIBER: "/admin/patchPrescriber"
    }
}