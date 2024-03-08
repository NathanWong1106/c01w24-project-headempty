import { COLLECTIONS } from "../constants.js"
import { PrescriberPrescription } from "../types/prescriptionTypes.js";
import { getDb } from "./dbConnection.js";
import paginate from "./pagination.js";

/**
 * Get a page from prescriber's prescriptions 
 * @param {Number} page the page number
 * @param {Number} pageSize size of the page
 * @param {String} providerCode providerCode of prescriber
 * @returns {PrescriberPrescription[]} an array of the prescribers log prescriptions
 */
export async function getPaginatedPrescriberPrescription(page, pageSize, providerCode) {
    const collection = getDb().collection(COLLECTIONS.PRESCRIBER_PRESCRIPTIONS);
    const data = await paginate(collection.find({providerCode: providerCode}), page, pageSize).toArray();
    return data.map(x => fillPrescriberPrescription(x));
}

function fillPrescriberPrescription(x) {
    return new PrescriberPrescription(x.providerCode, x.date, x.initial, x.prescribed, x.status);
}
