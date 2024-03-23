import { COLLECTIONS } from "../constants.js"
import { PatientPrescription } from "../types/prescriptionTypes.js";
import { getDb } from "./dbConnection.js";
import paginate from "./pagination.js";
import { objWithFields } from "./utils/dbUtils.js";
import { patientPrescriptionSearchSchema, prescriberPrescriptionSearchSchema } from "../schemas.js"; 

/**
 * Get a page from patient's prescriptions 
 * @param {Number} page the page number
 * @param {Number} pageSize size of the page
 * @param {Object} search search parameters
 * @returns {PrescriberPrescription[]} an array of the patient's log prescriptions
 */
export async function getPaginatedPatientPrescription(page, pageSize, search) {
    const searchObj = await objWithFields(search, patientPrescriptionSearchSchema);
    const collection = getDb().collection(COLLECTIONS.PATIENT_PRESCRIPTIONS);
    const data = await paginate(collection.find(searchObj), page, pageSize).toArray();
    return data.map(x => fillPatientPrescription(x));
}

export function fillPatientPrescription(x) {
    return new PatientPrescription(x.providerCode, x.date, x.initial, x.prescribed, x.status);
}

