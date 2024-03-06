import { COLLECTIONS } from "../constants.js"
import { PrescriberForm } from "../types/LogForm.js";
import { getDb } from "./dbConnection.js";
import paginate from "./pagination.js";

/**
 * Get a page from prescriber's form 
 * @param {Number} page the page number
 * @param {Number} pageSize size of the page
 * @param {String} providerCode providerCode of prescriber
 * @returns {PrescriberForm[]} an array of the prescribers log form
 */
export async function getPaginatedPrescriberForm(page, pageSize, providerCode) {
    const collection = getDb().collection(COLLECTIONS.PRESCRIBER_PRESCRIPTIONS);
    const data = await paginate(collection.find({providerCode: providerCode}), page, pageSize).toArray();
    return data.map(x => fillPrescriberForm(x));
}

function fillPrescriberForm(x) {
    return new PrescriberForm(x.providerCode, x.date, x.initial, x.prescribed, x.status);
}
