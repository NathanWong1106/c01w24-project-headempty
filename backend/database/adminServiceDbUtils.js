import { COLLECTIONS } from "../constants.js"
import { PrescriberInfo } from "../types/adminServiceTypes.js";
import { PatientPrescription, PrescriberPrescription } from "../types/prescriptionTypes.js";
import { getDb } from "./dbConnection.js";
import paginate from "./pagination.js";
import { objWithFields } from "./utils/dbUtils.js";
import { prescriberSearchSchema, prescriberPatchSchema, adminPrescriberPrescriptionSearchSchema, adminPrescriberPrescriptionPatchSchema, adminPatientPrescriptionSearchSchema, adminSinglePatientPrescriptionSearchSchema, adminSinglePrescriberPrescriptionSearchSchema } from "../schemas.js";
import { fillPrescriberPrescription } from "./prescriberServiceDbUtils.js";
import { fillPatientPrescription } from "./patientServiceDbUtils.js";
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
 * Get a patient prescriptions 
 * @param {Object} search search parameters
 * @returns {PatientPrescription || null} patient's log prescription
 */
export async function getAdminSinglePrescriberPrescription(search) {
    const searchObj = await objWithFields(search, adminSinglePrescriberPrescriptionSearchSchema);
    const collection = getDb().collection(COLLECTIONS.PRESCRIBER_PRESCRIPTIONS);
    const data = await collection.findOne(searchObj);
    if (!data) {
        return null;
    }
    return fillPrescriberPrescription(data);
}

/**
 * Patch a single prescription with patches
 * This is a generic function where you can then pass main/alt as prescriber/patient or patient/prescriber.
 * 
 * @param {string} providerCode provider code of the prescriber
 * @param {string} initial initials of patient
 * @param {string} date date of prescription
 * @param {Object} patches fields to patch
 * @param {string} patchSchema schema for casting patches to
 * @param {string} mainCollection db collection for main type prescription
 * @param {string} altCollection db collection for alt type prescription
 * @param {string} mainStatusEnum status enum for main type prescription
 * @param {string} altStatusEnum status enum for alt type prescription
 * @returns {string || null} relevant error string if error, else null
 */
export async function patchSinglePrescription(
    providerCode,
    initial,
    date,
    patches,
    patchSchema,
    mainCollection,
    altCollection,
    mainStatusEnum,
    altStatusEnum
) {
    const mainStr = mainCollection === "PRESCRIBER_PRESCRIPTIONS" ? "prescriber": "patient";
    const altStr = mainCollection === "PRESCRIBER_PRESCRIPTIONS" ? "patient": "prescriber";

    const patchObj = await objWithFields(patches, patchSchema);
    const mainPrescriptionCollection = getDb().collection(COLLECTIONS[mainCollection]);
    const altPrescriptionCollection = getDb().collection(COLLECTIONS[altCollection]);

    let mainPrescriptionData = null;
    let altPrescriptionData = null;
    const altPrescription = await altPrescriptionCollection.findOne({
        providerCode: providerCode,
        initial: initial,
        date: date,
    });
    
    if (!altPrescription) {
        // No update to status, update other fields
        if (patchObj["status"] === mainStatusEnum.NOT_LOGGED) {
            mainPrescriptionData = await mainPrescriptionCollection.updateOne(
                {
                    providerCode: providerCode,
                    initial: initial,
                    date: date,
                },
                { $set: patchObj }
            );
            if (mainPrescriptionData.matchedCount !== 1) {
                return `Error updating / could not find ${mainStr} prescription with providerCode: ${providerCode}, initial: ${initial}, date: ${date}.`;
            }
            return null;
        }
        // Shouldn't be allowed to set to any other status if no pa prescription
        else {
            return `Cannot set status to ${patchObj["status"]} for ${mainStr} prescription with providerCode: ${providerCode}, initial: ${initial}, date: ${date}. No corresponding patient prescription.`;
        }
    }

    // Pa logged, cannot have status pa not logged
    if (patchObj["status"] === mainStatusEnum.NOT_LOGGED) {
        return `Cannot set status to ${patchObj["status"]} for ${mainStr} prescription with providerCode: ${providerCode}, initial: ${initial}, date: ${date}. Found corresponding patient prescription.`;
    }

    // If status logged or complete, update both pa & pr correspondingly
    mainPrescriptionData = await mainPrescriptionCollection.updateOne(
        {
            providerCode: providerCode,
            initial: initial,
            date: date,
        },
        { $set: patchObj }
    );
    if (mainPrescriptionData.matchedCount !== 1) {
        return `Error updating / could not find ${mainStr} prescription with providerCode: ${providerCode}, initial: ${initial}, date: ${date}.`;
    }
    
    if ([mainStatusEnum.COMPLETE, mainStatusEnum.COMPLETE_WITH_DISCOVERY_PASS].includes(patchObj["status"])) {
        altPrescriptionData = await altPrescriptionCollection.updateOne(
            {
                providerCode: providerCode,
                initial: initial,
                date: date,
            },
            { $set: { status: patchObj["status"] } }
        );
    }
    // PRESCRIBER_PRESCRIPTION_STATUS.LOGGED
    else {
        altPrescriptionData = await altPrescriptionCollection.updateOne(
            {
                providerCode: providerCode,
                initial: initial,
                date: date,
            },
            { $set: { status: altStatusEnum.LOGGED } }
        );
    }
    
    if (altPrescriptionData.matchedCount !== 1) {
        return `Error updating corresponding ${altStr} prescription with providerCode: ${providerCode}, initial: ${initial}, date: ${date}, whereas ${mainStr} prescription data was updated, desync ocurred, fix in database.`;
    }
    return null;
}

/**
 * Get a patient prescriptions 
 * @param {Object} search search parameters
 * @returns {PatientPrescription || null} patient's log prescription
 */
export async function getAdminSinglePatientPrescription(search) {
    const searchObj = await objWithFields(search, adminSinglePatientPrescriptionSearchSchema);
    const collection = getDb().collection(COLLECTIONS.PATIENT_PRESCRIPTIONS);
    const data = await collection.findOne(searchObj);
    if (!data) {
        return null;
    }
    return fillPatientPrescription(data);
}

/**
 * Delete a prescriber prescription
 * @param {Object} search search parameters
 * @returns {boolean} true if successful, else false
 */
export async function deletePrescriberPrescription(search) {
    const searchObj = await objWithFields(search, adminSinglePrescriberPrescriptionSearchSchema);
    const collection = getDb().collection(COLLECTIONS.PRESCRIBER_PRESCRIPTIONS);
    const data = await collection.deleteOne(searchObj);
    return data.deletedCount === 1;
}
