import { COLLECTIONS } from "../constants.js"
import { PrescriberPrescription } from "../types/prescriptionTypes.js";
import { getDb } from "./dbConnection.js";
import paginate from "./pagination.js";
import { objWithFields } from "./utils/dbUtils.js";
import { prescriberPrescriptionSearchSchema } from "../schemas.js"; 
import { prescriberPrescriptionPatchSchema } from "../schemas.js";

/**
 * Get a page from prescriber's prescriptions 
 * @param {Number} page the page number
 * @param {Number} pageSize size of the page
 * @param {Object} search search parameters
 * @returns {PrescriberPrescription[]} an array of the prescribers log prescriptions
 */

export async function postSinglePrescription(providerCode, patches) {
    console.log("postSinglePrescription");
    const patchObj = await objWithFields(patches, prescriberPrescriptionPatchSchema);
    console.log(patches);
    console.log(prescriberPrescriptionPatchSchema);
    console.log(patchObj);
    const collection = getDb().collection(COLLECTIONS.PRESCRIBER_PRESCRIPTIONS);
    const data = await collection.insertOne(patchObj);
    

    return data.matchedCount === 1;
}
/**
 * Check if an entry with the given parameters exists in the database
 * @param {Object} search search parameters
 * @returns {boolean} true if an entry is found, false otherwise
 */
export async function checkMatchingPrescription(providerCode, date, initial) {
    console.log("checkEntryExistence");
    console.log(search);
    const searchObj = await objWithFields(providerCode, date, initial, prescriberPrescriptionSearchSchema);
    const collection = getDb().collection(COLLECTIONS.PATIENT_PRESCRIPTIONS);
    const data = await collection.findOne(searchObj);
    return data !== null;
}

export async function getPaginatedPrescriberPrescription(page, pageSize, search) {
    console.log("getPaginatedPrescriberPrescription");
    console.log(search);
    const searchObj = await objWithFields(search, prescriberPrescriptionSearchSchema);
    const collection = getDb().collection(COLLECTIONS.PRESCRIBER_PRESCRIPTIONS);
    const data = await paginate(collection.find(searchObj), page, pageSize).toArray();
    return data.map(x => fillPrescriberPrescription(x));
}

function fillPrescriberPrescription(x) {
    return new PrescriberPrescription(x.providerCode, x.date, x.initial, x.prescribed, x.status);
}

