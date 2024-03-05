import { COLLECTIONS } from "../constants.js"
import { PrescriberInfo } from "../types/adminServiceTypes.js";
import { getDb } from "./dbConnection.js";
import paginate from "./pagination.js";

const prescriberSearchFields = ["email", "firstName", "lastName", "providerCode", "licensingCollege", "licenseNumber"];
const prescriberPatchFields = ["email", "firstName", "lastName", "language", "city", "province", "profession", "licensingCollege", "licenseNumber"];

/**
 * Get a page from all prescribers 
 * @param {Number} page the page number
 * @param {Number} pageSize size of the page
 * @param {Object} search search parameters
 * @returns {PrescriberInfo[]} an array of the prescribers
 */
export async function getPaginatedPrescriber(page, pageSize, search) {
    const searchObj = objWithFields(prescriberSearchFields, search);

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

/**
 * Patch a single prescriber with patches
 * @param {string} providerCode provider code of the prescriber
 * @param {Object} patches fields to patch
 * @returns {boolean} true if successful, else false
 */
export async function patchSinglePrescriber(providerCode, patches) {
    const patchObj = objWithFields(prescriberPatchFields, patches);
    const collection = getDb().collection(COLLECTIONS.PRESCRIBER);
    const data = await collection.updateOne({ providerCode: providerCode }, { $set: patchObj });

    return data.matchedCount === 1;
}

function objWithFields(fieldsList, referenceObj) {
    let obj = {};

    for (let field of fieldsList) {
        if (referenceObj[field]) {
            obj[field] = referenceObj[field];
        }
    }

    return obj;
}