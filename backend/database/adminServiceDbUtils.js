import { COLLECTIONS } from "../constants.js"
import { getDb } from "./dbConnection.js";

/**
 * TODO: stub - Get a page from all prescribers 
 * @param {Number} page the page number
 * @param {Number} pageSize size of the page
 * @param {Object} search search parameters
 * @returns {Array<Object>} an array of the prescribers
 */
export async function getPaginatedPrescriber(page, pageSize, search) {
    const collection = getDb().collection(COLLECTIONS.PRESCRIBER);
    const data = await collection.find(search).limit(pageSize).skip((page - 1) * pageSize).toArray();

    // TODO: const retList = data.map()
}