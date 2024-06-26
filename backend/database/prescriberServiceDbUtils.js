import { COLLECTIONS } from "../constants.js"
import { PrescriberPrescription } from "../types/prescriptionTypes.js";
import { getDb } from "./dbConnection.js";
import paginate from "./pagination.js";
import { objWithFields } from "./utils/dbUtils.js";
import { prescriberPrescriptionSearchSchema } from "../schemas.js"; 
import { prescriberPrescriptionPatchSchema } from "../schemas.js";
import { ObjectId } from "mongodb";



export async function postSinglePrescription(providerCode, posts) {
    const postObj = await objWithFields(posts, prescriberPrescriptionPatchSchema);
    const collection = getDb().collection(COLLECTIONS.PRESCRIBER_PRESCRIPTIONS);
    const data = await collection.insertOne(postObj);
    return true;
}

/**
 * Get a page from prescriber's prescriptions 
 * @param {Number} page the page number
 * @param {Number} pageSize size of the page
 * @param {Object} search search parameters
 * @returns {PrescriberPrescription[]} an array of the prescribers log prescriptions
 */

export async function getPaginatedPrescriberPrescription(page, pageSize, search) {
    const searchObj = await objWithFields(search, prescriberPrescriptionSearchSchema);
    const collection = getDb().collection(COLLECTIONS.PRESCRIBER_PRESCRIPTIONS);
    const data = await paginate(collection.find(searchObj), page, pageSize).toArray();
    return data.map(x => fillPrescriberPrescription(x));
}


export function fillPrescriberPrescription(x) {
    return new PrescriberPrescription(x.providerCode, x.date, x.initial, x.prescribed, x.status);
}

export async function getMatchingPrescriberPrescription(providerCode, date, initial) {
    const search = {
        providerCode: providerCode,
        date: date,
        initial: initial
    };

    const searchObj = await objWithFields(search, prescriberPrescriptionPatchSchema);
    const collection = getDb().collection(COLLECTIONS.PRESCRIBER_PRESCRIPTIONS);
    const data = await collection.findOne(searchObj);
    if (data !== null) {
        return [true, data._id, data.prescribed]
    }
    return [false, null];
}

export async function patchPrescriberPrescriptionStatus(id, patStatus) {
    const collection = getDb().collection(COLLECTIONS.PRESCRIBER_PRESCRIPTIONS);
    const data = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { status: patStatus } });

    if (data.matchedCount === 1) {
        return true;
    }
    return false;
    
}
