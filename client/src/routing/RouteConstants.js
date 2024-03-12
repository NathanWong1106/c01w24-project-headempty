export const ROUTES = {
    BASE: '/',
    LOGIN: '/login',
    HOME: '/home'
}

export const ADMIN_ROUTE_BASE = '/admin'
export const ADMIN_ROUTES = {
    PRESCRIBER_MNGMT: `${ADMIN_ROUTE_BASE}/prescriberManagement`
}

export const PRESCRIBER_ROUTE_BASE = '/prescriber'
export const PRESCRIBER_ROUTES = {
    PRESCRIPTIONS: `${PRESCRIBER_ROUTE_BASE}/getPaginatedPrescriptions`
}


/* Below is for use in the sidebar / drawer */
const COMMON_LINKS = [
    {
        name: "Home",
        link: ROUTES.HOME
    }
]

/* Common links for both assistant and coordinator */
const ADMIN_LINKS = [
    ...COMMON_LINKS,
    {
        name: "Prescriber Management",
        link: ADMIN_ROUTES.PRESCRIBER_MNGMT
    }
]

/* Assistant links is equivalent to admin */
export const ASSISTANT_LINKS = [...ADMIN_LINKS]

/* A coordinator can do everything an assistant can + additionally manage patients. */
export const COORDINATOR_LINKS = [...ASSISTANT_LINKS]

/* Links for prescribers */
export const PRESCRIBER_LINKS = [
    ...COMMON_LINKS,
    {
        name: "View All Your Prescription",
        link: PRESCRIBER_ROUTES.PRESCRIPTIONS
    }
];

/* Links for patients */
export const PATIENT_LINKS = [...COMMON_LINKS]