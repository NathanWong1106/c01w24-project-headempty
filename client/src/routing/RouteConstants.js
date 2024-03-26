export const ROUTES = {
    BASE: '/',
    LOGIN: '/login',
    HOME: '/home',
    GREEN_RESOURCES: '/greenResources',
}

export const REGISTRATION_ROUTE_BASE = '/register' 
export const REGISTRATION_ROUTES = {
    PATIENT_REGISTRATION: '/register/patient',
    PRESCRIBER_REGISTRATION: '/register/:prescriberId'
}

export const ADMIN_ROUTE_BASE = '/admin'
export const ADMIN_ROUTES = {
    PRESCRIBER_MNGMT: `${ADMIN_ROUTE_BASE}/prescriberManagement`,
    PRESCRIBER_PRESCRIPTION_MNGMT: `${ADMIN_ROUTE_BASE}/prescriberPrescriptionManagement`,
    PRESCRIBER_VERIFICATION: `${ADMIN_ROUTE_BASE}/prescriberVerification`,
}

export const COORDINATOR_ROUTE_BASE = "/coordinator"
export const COORDINATOR_ROUTES = {
    PATIENT_MNGMT: `${COORDINATOR_ROUTE_BASE}/patientManagement`,
    PATIENT_PRESCRIPTION_MNGMT: `${COORDINATOR_ROUTE_BASE}/patientPrescriptionManagement`,
}

export const PRESCRIBER_ROUTE_BASE = '/prescriber'
export const PRESCRIBER_ROUTES = {
    PRESCRIPTIONS: `${PRESCRIBER_ROUTE_BASE}/myPrescriptions`,
    PRESC_FORM: `${PRESCRIBER_ROUTE_BASE}/prescriptionForm`
}

export const PATIENT_ROUTE_BASE = '/patient'
export const PATIENT_ROUTES = {
    PRESCRIPTIONS: `${PATIENT_ROUTE_BASE}/myPrescriptions`
}



/* Below is for use in the sidebar / drawer */
const COMMON_LINKS = [
    {
        name: "Home",
        link: ROUTES.HOME
    },
    {
        name: "Green Resources",
        link: ROUTES.GREEN_RESOURCES
    }
]

/* Common links for both assistant and coordinator */
const ADMIN_LINKS = [
    ...COMMON_LINKS,
    {
        name: "Prescriber Management",
        link: ADMIN_ROUTES.PRESCRIBER_MNGMT
    },
    {
        name: "Prescriber Prescription Management",
        link: ADMIN_ROUTES.PRESCRIBER_PRESCRIPTION_MNGMT
    },
    {
        name: "Prescriber Verification",
        link: ADMIN_ROUTES.PRESCRIBER_VERIFICATION
    }
]

/* Assistant links is equivalent to admin */
export const ASSISTANT_LINKS = [...ADMIN_LINKS]

/* A coordinator can do everything an assistant can + additionally manage patients. */
export const COORDINATOR_LINKS = [
    ...ASSISTANT_LINKS,
    {
        name: "Patient Management",
        link: COORDINATOR_ROUTES.PATIENT_MNGMT
    },
    {
        name: "Patient Prescription Management",
        link: COORDINATOR_ROUTES.PATIENT_PRESCRIPTION_MNGMT,
    }
]

/* Links for prescribers */
export const PRESCRIBER_LINKS = [
    ...COMMON_LINKS,
    {
        name: "My Prescriptions",
        link: PRESCRIBER_ROUTES.PRESCRIPTIONS
    }
];

/* Links for patients */
export const PATIENT_LINKS = [
    ...COMMON_LINKS,
    {
        name: "My Prescriptions",
        link: PATIENT_ROUTES.PRESCRIPTIONS
    }
];