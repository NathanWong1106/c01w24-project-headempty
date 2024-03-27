export const SERVER_ADDRESS = process.env.REACT_APP_API_ADDRESS;

export const SERVER_PATHS = {
    LOGIN: "/user/login",
    PRESCRIBER_REGISTRATION: "/user/registration",
    PATIENT_REGISTRATION: "/user/register/patient",
    ADMIN_SERVICE: {
        GET_PAGINATED_PRESCRIBERS: "/admin/getPaginatedPrescribers",
        PATCH_PRESCRIBER: "/admin/patchPrescriber",
        ADD_PRESCRIBER: "/admin/addPrescriber",
        GET_PAGINATED_PRESCRIBER_PRESCRIPTION: "/admin/getAdminPaginatedPrescriberPrescription",
        PATCH_SINGLE_PRESCRIBER_PRESCRIPTION: "/admin/patchSinglePrescriberPrescription",
        DELETE_PRESCRIBER_PRESCRIPTION: "/admin/deletePrescriberPrescription",
        GET_SINGLE_PATIENT_PRESCRIPTION: "/admin/getAdminSinglePatientPrescription",
        GET_SINGLE_PRESCRIBER_PRESCRIPTION: "/admin/getAdminSinglePrescriberPrescription",
    },
    COORDINATOR_SERVICE: {
        GET_PAGINATED_PATIENTS: "/coordinator/getPaginatedPatients",
        PATCH_PATIENT: "/coordinator/patchPatient",
        GET_PAGINATED_PATIENT_PRESCRIPTION: "/coordinator/getCoordinatorPaginatedPatientPrescription",
        PATCH_SINGLE_PATIENT_PRESCRIPTION: "/coordinator/patchSinglePatientPrescription",
        DELETE_PATIENT_PRESCRIPTION: "/coordinator/deletePatientPrescription",
    },

    VERIFY_PRESCRIBERS: "/verification/verifyPrescribers",
    PRESCRIBER_SERVICE: {
        GET_PAGINATED_PRESCRIPTIONS: "/prescriber/getPaginatedPrescriptions",
        POST_PRESCRIPTION: "/prescriber/postPrescription",
    },

    PATIENT_SERVICE: {
        GET_PAGINATED_PRESCRIPTIONS: "/patient/getPaginatedPrescriptions",
        POST_PRESCRIPTION: "/patient/postPrescription",
    }
}