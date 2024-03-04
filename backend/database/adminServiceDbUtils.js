import { COLLECTIONS } from "../constants.js"
import { PrescriberInfo } from "../types/adminServiceTypes.js";
import { getDb } from "./dbConnection.js";
import paginate from "./pagination.js";

const prescriberSearchFields = ["email", "firstName", "lastName", "providerCode", "licensingCollege", "licenseNumber"];

/**
 * Get a page from all prescribers 
 * @param {Number} page the page number
 * @param {Number} pageSize size of the page
 * @param {Object} search search parameters
 * @returns {PrescriberInfo[]} an array of the prescribers
 */
export async function getPaginatedPrescriber(page, pageSize, search) {
    let searchObj = {};
    for (let field of prescriberSearchFields) {
        if (search[field]) {
            searchObj[field] = search[field];
        }
    }

    const collection = getDb().collection(COLLECTIONS.PRESCRIBER);
    const data = await paginate(collection.find(searchObj), page, pageSize).toArray();
    return data.map(x => fillPrescriber(x));
}

function fillPrescriber(x) {
    return new PrescriberInfo(x.email, x.firstName, x.lastName,
        x.language, x.city, x.province,
        x.address, x.profession, x.providerCode,
        x.licensingCollege, x.licenseNumber, x.registered);
}