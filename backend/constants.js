import 'dotenv/config'

export const COLLECTIONS = {
    ADMINS: "admins",
    PRESCRIBER: "prescribers",
    PATIENT: "patients",
    PATIENT_PRESCRIPTIONS: "patient_prescriptions",
    PRESCRIBER_PRESCRIPTIONS: "prescriber_prescriptions"
}

export const SERVER = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    DB_NAME: process.env.DB_NAME,
    PUPPETEER_BROWSER_PATH: process.env.PUPPETEER_BROWSER_PATH
}