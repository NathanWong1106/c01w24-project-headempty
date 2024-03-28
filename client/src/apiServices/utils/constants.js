export const SERVER_ADDRESS = process.env.REACT_APP_API_ADDRESS;

export const SERVER_PATHS = {
    LOGIN: "/user/login",
    PRESCRIBER_REGISTRATION: "/user/registration",
    PATIENT_REGISTRATION: "/user/register/patient",
    ADMIN_SERVICE: {
        GET_PAGINATED_PRESCRIBERS: "/admin/getPaginatedPrescribers",
        PATCH_PRESCRIBER: "/admin/patchPrescriber",
<<<<<<< HEAD
        ADD_PRESCRIBER: "/admin/addPrescriber",
=======
>>>>>>> 31c4c9ee3f8afe094a8aa16e0bf25898433159d7
        GET_PAGINATED_PRESCRIBER_PRESCRIPTION: "/admin/getAdminPaginatedPrescriberPrescription",
        PATCH_SINGLE_PRESCRIBER_PRESCRIPTION: "/admin/patchSinglePrescriberPrescription",
        DELETE_PRESCRIBER_PRESCRIPTION: "/admin/deletePrescriberPrescription",
        GET_SINGLE_PATIENT_PRESCRIPTION: "/admin/getAdminSinglePatientPrescription",
        GET_SINGLE_PRESCRIBER_PRESCRIPTION: "/admin/getAdminSinglePrescriberPrescription",
<<<<<<< HEAD
=======
    },
    COORDINATOR_SERVICE: {
        GET_PAGINATED_PATIENTS: "/coordinator/getPaginatedPatients",
        PATCH_PATIENT: "/coordinator/patchPatient",
        GET_PAGINATED_PATIENT_PRESCRIPTION: "/coordinator/getCoordinatorPaginatedPatientPrescription",
        PATCH_SINGLE_PATIENT_PRESCRIPTION: "/coordinator/patchSinglePatientPrescription",
        DELETE_PATIENT_PRESCRIPTION: "/coordinator/deletePatientPrescription",
>>>>>>> 31c4c9ee3f8afe094a8aa16e0bf25898433159d7
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
<<<<<<< HEAD
        GET_PAGINATED_PRESCRIPTIONS: "/prescriber/getPaginatedPrescriptions",
        POST_PRESCRIPTION: "/prescriber/postPrescription",
    },

    PATIENT_SERVICE: {
        GET_PAGINATED_PRESCRIPTIONS: "/patient/getPaginatedPrescriptions",
        POST_PRESCRIPTION: "/patient/postPrescription",
        PATCH_ADDRESS: "/patient/patchAddress"
=======
        GET_PAGINATED_PRESCRIPTIONS: "/prescriber/getPaginatedPrescriptions"
    },
    PATIENT_SERVICE: {
        GET_PAGINATED_PRESCRIPTIONS: "/patient/getPaginatedPrescriptions"
>>>>>>> 31c4c9ee3f8afe094a8aa16e0bf25898433159d7
    }
}