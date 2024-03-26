import 'dotenv/config'

export const COLLECTIONS = {
    ADMINS: "admins",
    PRESCRIBER: "prescribers",
    PATIENT: "patients",
    PATIENT_PRESCRIPTIONS: "patient_prescriptions",
    PRESCRIBER_PRESCRIPTIONS: "prescriber_prescriptions",
    PROVIDER_CODE_NUMBER: "provider_code_number",
}

export const SERVER = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    DB_NAME: process.env.NODE_ENV=="test" ? process.env.TEST_DB_NAME : process.env.DB_NAME,
    RUN_PUPPETEER: process.env.RUN_PUPPETEER,
}

export const PROVINCES = ["AB", "BC", "MB", "NB", "NL", "NS", "ON", "PE", "QC", "SK"];

export const COLLEGES = [
    "College of Physicians and Surgeons of Alberta",
    "College of Physicians and Surgeons of British Columbia",
    "College of Physicians and Surgeons of Manitoba",
    "College of Physicians and Surgeons of New Brunswick",
    "College of Physicians and Surgeons of Newfoundland and Labrador",
    "College of Physicians and Surgeons of Nova Scotia",
    "College of Physicians and Surgeons of Ontario",
    "College of Physicians & Surgeons of Prince Edward Island",
    "Collège des médecins du Québec",
    "College of Physicians and Surgeons of Saskatchewan",
];

export const PRESCRIPTION_TYPES = {
    PRESCRIBER: "prescriber",
    PATIENT: "patient",
}