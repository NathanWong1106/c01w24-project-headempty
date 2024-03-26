import { COLLECTIONS } from "../constants.js"
import { PrescriberInfo } from "../types/adminServiceTypes.js";
import { getDb } from "./dbConnection.js";
import paginate from "./pagination.js";
import { objWithFields } from "./utils/dbUtils.js";
import { prescriberSearchSchema, prescriberPatchSchema } from "../schemas.js";
import { retryPromiseWithDelay } from "../utils.js";
import bcrypt from "bcryptjs";

/**
 * Get a page from all prescribers 
 * @param {Number} page the page number
 * @param {Number} pageSize size of the page
 * @param {Object} search search parameters
 * @returns {PrescriberInfo[]} an array of the prescribers
 */
export async function getPaginatedPrescriber(page, pageSize, search) {
    const searchObj = await objWithFields(search, prescriberSearchSchema);
    const collection = getDb().collection(COLLECTIONS.PRESCRIBER);
    const data = await paginate(collection.find(searchObj), page, pageSize).toArray();
    return data.map(x => fillPrescriber(x));
}

function fillPrescriber(x) {
    return new PrescriberInfo(x.email, x.firstName, x.lastName,
        x.language, x.city, x.province,
        x.address, x.profession, x.providerCode,
        x.licensingCollege, x.licenceNumber, x.registered);
}

/**
 * Patch a single prescriber with patches
 * @param {string} providerCode provider code of the prescriber
 * @param {Object} patches fields to patch
 * @returns {boolean} true if successful, else false
 */
export async function patchSinglePrescriber(providerCode, patches) {
    const patchObj = await objWithFields(patches, prescriberPatchSchema);
    const collection = getDb().collection(COLLECTIONS.PRESCRIBER);
    const data = await collection.updateOne({ providerCode: providerCode }, { $set: patchObj });

    return data.matchedCount === 1;
}

export async function addSinglePrescriber(prescriber) {
    try {
        const collection = getDb().collection(COLLECTIONS.PRESCRIBER);
        const existingUserEmail = await retryPromiseWithDelay(collection.findOne({
            email: prescriber.email,
        }))

        if (existingUserEmail) {
            return { data: null, error: "Email already used" };
        }

        const existingUserProviderCode = await retryPromiseWithDelay(collection.findOne({
            providerCode: prescriber.providerCode,
        }))

        if (existingUserProviderCode) {
            return { data: null, error: "Provider Code already used" };
        }

        const hashedPassword = await bcrypt.hash(prescriber.password, 10);
        const data = await retryPromiseWithDelay(collection.insertOne({
            email: prescriber.email,
            password: hashedPassword,
            firstName: prescriber.firstName,
            lastName: prescriber.lastName,
            language: prescriber.language,
            city: prescriber.city,
            province: prescriber.province,
            address: prescriber.address,
            profession: prescriber.profession,
            providerCode: prescriber.providerCode,
            licensingCollege: prescriber.licensingCollege,
            licenceNumber: prescriber.licenceNumber,
            registered: prescriber.registered
        }));
        return { data: data, error: null };
    } catch (error) {
        console.error('Error adding patient:', error.message);
        return { data: null, error: error };
    }
}