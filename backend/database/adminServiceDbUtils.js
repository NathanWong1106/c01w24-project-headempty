import { COLLECTIONS } from "../constants.js"
import { PrescriberInfo } from "../types/adminServiceTypes.js";
import { PrescriberPrescription } from "../types/prescriptionTypes.js";
import { getDb } from "./dbConnection.js";
import paginate from "./pagination.js";
import { objWithFields } from "./utils/dbUtils.js";
import { prescriberSearchSchema, prescriberPatchSchema, adminPrescriberPrescriptionSearchSchema, adminPrescriberPrescriptionPatchSchema } from "../schemas.js";
import { fillPrescriberPrescription } from "./prescriberServiceDbUtils.js";
import { PRESCRIBER_PRESCRIPTION_STATUS, PATIENT_PRESCRIPTION_STATUS } from "../types/prescriptionTypes.js";

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

/**
 * Get a page of prescriber prescriptions 
 * @param {Number} page the page number
 * @param {Number} pageSize size of the page
 * @param {Object} search search parameters
 * @returns {PrescriberPrescription[]} an array of the prescribers log prescriptions
 */
export async function getAdminPaginatedPrescriberPrescription(page, pageSize, search) {
    const searchObj = await objWithFields(search, adminPrescriberPrescriptionSearchSchema);
    const collection = getDb().collection(COLLECTIONS.PRESCRIBER_PRESCRIPTIONS);
    const data = await paginate(collection.find(searchObj), page, pageSize).toArray();
    return data.map(x => fillPrescriberPrescription(x));
}

/**
 * Patch a single prescriber prescription with patches
 * @param {string} providerCode provider code of the prescriber
 * @param {Object} patches fields to patch
 * @returns {boolean} true if successful, else false
 */
export async function patchSinglePrescriberPrescription(providerCode, initial, date, patches) {
    const patchObj = await objWithFields(patches, adminPrescriberPrescriptionPatchSchema);
    const prPrescriptionCollection = getDb().collection(COLLECTIONS.PRESCRIBER_PRESCRIPTIONS);
    const paPrescriptionCollection = getDb().collection(COLLECTIONS.PATIENT_PRESCRIPTIONS);
    const prPrescriptionData = null;
    const paPrescriptionData = null;
    const paPrescription = await paPrescriptionCollection.findOne({
        providerCode: providerCode,
        initial: initial,
        date: date,
    });
    
    if (!paPrescription) {
        // No update to status, update other fields
        if (patchObj["status"] !== PRESCRIBER_PRESCRIPTION_STATUS.NOT_LOGGED) {
            prPrescriptionData = await prPrescriptionCollection.updateOne(
                {
                    providerCode: providerCode,
                    initial: initial,
                    date: date,
                },
                { $set: patchObj }
            );
            return prPrescriptionData.matchedCount === 1;
        }
        // Shouldn't be allowed to set to any other status if no pa prescription
        else {
            return false;
        }
    }

    // Pa logged, cannot have status pa not logged
    if (patchObj["status"] === PRESCRIBER_PRESCRIPTION_STATUS.NOT_LOGGED) {
        return false;
    }

    // If status logged or complete, update pr in both cases
    // Only update pa if complete
    prPrescriptionData = await prPrescriptionCollection.updateOne(
        {
            providerCode: providerCode,
            initial: initial,
            date: date,
        },
        { $set: patchObj }
    );
    if (prPrescriptionData.matchedCount !== 1) return false;
    
    if ([PRESCRIBER_PRESCRIPTION_STATUS.COMPLETE, PRESCRIBER_PRESCRIPTION_STATUS.COMPLETE_WITH_DISCOVERY_PASS].includes(patchObj["status"])) {
        paPrescriptionData = await paPrescriptionCollection.updateOne(
            {
                providerCode: providerCode,
                initial: initial,
                date: date,
            },
            { $set: { status: patchObj["status"] } }
        );
        if (paPrescriptionData.matchedCount !== 1) return false;
    }
    
    return true;
}