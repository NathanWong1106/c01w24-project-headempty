import { COLLECTIONS } from "../constants.js"
import { PatientPrescription } from "../types/prescriptionTypes.js";
import { getDb } from "./dbConnection.js";
import paginate from "./pagination.js";
import { objWithFields } from "./utils/dbUtils.js";
import { patientPrescriptionSearchSchema } from "../schemas.js"; 

/**
 * Get a page from prescriber's prescriptions 
 * @param {Number} page the page number
 * @param {Number} pageSize size of the page
 * @param {Object} search search parameters
 * @returns {PatientPrescription[]} an array of the prescribers log prescriptions
 */
export async function getPaginatedPatientPrescription(page, pageSize, search) {
    const searchObj = await objWithFields(search, patientPrescriptionSearchSchema);
    const collection = getDb().collection(COLLECTIONS.PATIENT_PRESCRIPTIONS);
    const data = await paginate(collection.find(searchObj), page, pageSize).toArray();
    return data.map(x => fillPatientPrescription(x));
}

function fillPatientPrescription(x) {
    return new PatientPrescription(x.providerCode, x.date, x.initial, x.prescribed, x.status);
}

