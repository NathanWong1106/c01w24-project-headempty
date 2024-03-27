import { COLLECTIONS } from "../constants.js"
import { PatientPrescription } from "../types/prescriptionTypes.js";
import { getDb } from "./dbConnection.js";
import paginate from "./pagination.js";
import { objWithFields } from "./utils/dbUtils.js";

import { patientPrescriptionFindSchema, patientPrescriptionSearchSchema, prescriberPrescriptionSearchSchema } from "../schemas.js"; 
import { ObjectId } from "mongodb";



export async function postSinglePatientPrescription(providerCode, posts) {
    const postObj = await objWithFields(posts, patientPrescriptionSearchSchema);
    const collection = getDb().collection(COLLECTIONS.PATIENT_PRESCRIPTIONS);
    const data = await collection.insertOne(postObj);
    return true;
}


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
    return new PatientPrescription(x.providerCode, x.date, x.initial, x.prescribed, x.status, x.email);
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

export async function patchPatientPrescriptionStatus(id, checked, patStatus) {
    const collection = getDb().collection(COLLECTIONS.PATIENT_PRESCRIPTIONS);
    const data = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { status: patStatus, prescribed: checked} });

    if (data.matchedCount === 1) {
        return true;
    } else {
        return false;
    }
}

