export const SERVER_ADDRESS = process.env.REACT_APP_API_ADDRESS;

export const SERVER_PATHS = {
    LOGIN: "/user/login",
    PRESCRIBER_REGISTRATION: "/user/registration",
    PATIENT_REGISTRATION: "/user/register/patient",
    ADMIN_SERVICE: {
        GET_PAGINATED_PRESCRIBERS: "/admin/getPaginatedPrescribers",
        PATCH_PRESCRIBER: "/admin/patchPrescriber",
        GET_PAGINATED_PRESCRIBER_PRESCRIPTIONS: "/admin/getAdminPaginatedPrescriberPrescriptions",
        PATCH_SINGLE_PRESCRIBER_PRESCRIPTION: "/admin/patchSinglePrescriberPrescription",
        DELETE_PRESCRIBER_PRESCRIPTION: "/admin/deletePrescriberPrescription",
        GET_SINGLE_PATIENT_PRESCRIPTION: "/admin/getAdminSinglePatientPrescription",
    },
    COORDINATOR_SERVICE: {
        GET_PAGINATED_PATIENTS: "/coordinator/getPaginatedPatients",
        PATCH_PATIENT: "/coordinator/patchPatient"
    },
    VERIFY_PRESCRIBERS: "/verification/verifyPrescribers",
    PRESCRIBER_SERVICE: {
        GET_PAGINATED_PRESCRIPTIONS: "/prescriber/getPaginatedPrescriptions"
    },
    PATIENT_SERVICE: {
        GET_PAGINATED_PRESCRIPTIONS: "/patient/getPaginatedPrescriptions"
    }
}