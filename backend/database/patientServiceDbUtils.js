import { COLLECTIONS } from "../constants.js"
import { PatientPrescription } from "../types/prescriptionTypes.js";
import { getDb } from "./dbConnection.js";
import paginate from "./pagination.js";
import { objWithFields } from "./utils/dbUtils.js";
import { patientPrescriptionFindSchema, patientPrescriptionSearchSchema } from "../schemas.js"; 
import { ObjectId } from "mongodb";

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

/**
 * Check if there is a matching patient prescription in the database.
 * @param {string} providerCode - The provider code.
 * @param {Date} date - The date of the prescription.
 * @param {string} initial - The initial of the prescription.
 * @returns {boolean} - True if a matching patient prescription exists, false otherwise.
 */
export async function getMatchingPatientPrescription(providerCode, date, initial) {
    const search = {
        providerCode: providerCode,
        date: date,
        initial: initial
    };

    const searchObj = await objWithFields(search, patientPrescriptionFindSchema);
    const collection = getDb().collection(COLLECTIONS.PATIENT_PRESCRIPTIONS);
    const data = await collection.findOne(searchObj);
    if (data !== null) {
        return [true, data._id]
    }
    return [false, null];
}

export async function patchPatientPrescriptionStatus(id, patStatus) {
    const collection = getDb().collection(COLLECTIONS.PATIENT_PRESCRIPTIONS);
    const data = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { status: patStatus } });

    if (data.matchedCount === 1) {
        return res.status(200).json({ message: `Successfully updated prescription status.` });
    } else {
        return res.status(404).json({ error: `Failed to update prescription status.` });
    }
}

