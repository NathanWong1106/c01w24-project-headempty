import { COLLECTIONS, PRESCRIPTION_TYPES } from "../constants.js"
import { PrescriberInfo } from "../types/adminServiceTypes.js";
import { PatientPrescription, PrescriberPrescription } from "../types/prescriptionTypes.js";
import { getDb } from "./dbConnection.js";
import paginate from "./pagination.js";
import { objWithFields } from "./utils/dbUtils.js";
import { prescriberSearchSchema, prescriberPatchSchema, adminPrescriberPrescriptionSearchSchema, adminPrescriberPrescriptionPatchSchema, adminPatientPrescriptionSearchSchema, adminSinglePatientPrescriptionSearchSchema, adminSinglePrescriberPrescriptionSearchSchema, adminPatientPrescriptionPatchSchema } from "../schemas.js";
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
    return new PrescriberInfo(x._id, x.email, x.firstName, x.lastName,
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
 * Get a prescriber prescriptions
 * @param {Object} search search parameters
 * @returns {PatientPrescription || null} prescriber's log prescription
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
 * @param {string} type type of prescription to patch. One of PRESCRIPTION_TYPES.
 * @param {string} providerCode provider code of the prescriber
 * @param {string} initial initials of patient
 * @param {string} date date of prescription
 * @param {Object} patches fields to patch
 * @returns {string || null} relevant error string if error, else null
 */
export async function patchSinglePrescription(
    type,
    providerCode,
    initial,
    date,
    prescribed,
    patches,
) {
    let mainStr, altStr, patchSchema, mainCollection, altCollection, mainStatusEnum, altStatusEnum;
    if (type === PRESCRIPTION_TYPES.PRESCRIBER) {
        mainStr = PRESCRIPTION_TYPES.PRESCRIBER;
        altStr = PRESCRIPTION_TYPES.PATIENT;
        patchSchema = adminPrescriberPrescriptionPatchSchema;
        mainCollection = COLLECTIONS.PRESCRIBER_PRESCRIPTIONS;
        altCollection = COLLECTIONS.PATIENT_PRESCRIPTIONS;
        mainStatusEnum = PRESCRIBER_PRESCRIPTION_STATUS;
        altStatusEnum = PATIENT_PRESCRIPTION_STATUS;
    }
    // PRESCRIPTION_TYPES.PATIENT
    else {
        mainStr = PRESCRIPTION_TYPES.PATIENT;
        altStr = PRESCRIPTION_TYPES.PRESCRIBER;
        patchSchema = adminPatientPrescriptionPatchSchema;
        mainCollection = COLLECTIONS.PATIENT_PRESCRIPTIONS;
        altCollection = COLLECTIONS.PRESCRIBER_PRESCRIPTIONS;
        mainStatusEnum = PATIENT_PRESCRIPTION_STATUS;
        altStatusEnum = PRESCRIBER_PRESCRIPTION_STATUS;
    }

    const patchObj = await objWithFields(patches, patchSchema);
    const mainPrescriptionCollection = getDb().collection(mainCollection);
    const altPrescriptionCollection = getDb().collection(altCollection);

    let mainPrescriptionData = null;
    let altPrescriptionData = null;
    const altPrescription = await altPrescriptionCollection.findOne({
        providerCode: providerCode,
        initial: initial,
        date: date,
    });
    
    if (!altPrescription) {
        // No update to status, update other fields
        if (!("status" in patchObj) || patchObj["status"] === mainStatusEnum.NOT_LOGGED) {
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
    if ("status" in patchObj && patchObj["status"] === mainStatusEnum.NOT_LOGGED) {
        return `Cannot set status to ${patchObj["status"]} for ${mainStr} prescription with providerCode: ${providerCode}, initial: ${initial}, date: ${date}. Found corresponding patient prescription.`;
    }

    if (!("status" in patchObj) ||
        (prescribed && [mainStatusEnum.LOGGED, mainStatusEnum.COMPLETE_WITH_DISCOVERY_PASS].includes(patchObj["status"])) ||
        (!prescribed && patchObj["status"] === mainStatusEnum.COMPLETE)
    ) {
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

        // Following tries to update alt prescription status, if status not patched, early exit
        if (!("status" in patchObj)) return null;

        const altPatchObj = {
            // Since Pa logged and Pr logged different
            status: patchObj["status"] === mainStatusEnum.LOGGED ? altStatusEnum.LOGGED : patchObj["status"],
            prescribed: prescribed
        };

        altPrescriptionData = await altPrescriptionCollection.updateOne(
            {
                providerCode: providerCode,
                initial: initial,
                date: date,
            },
            { $set: altPatchObj }
        );
        if (altPrescriptionData.matchedCount !== 1) {
            return `Error updating corresponding ${altStr} prescription with providerCode: ${providerCode}, initial: ${initial}, date: ${date}, whereas ${mainStr} prescription data was updated, desync ocurred, fix in database.`;
        }
        return null;
    }
    else {
        return `Invalid combination of prescribed Discovery Pass: ${prescribed} and status: ${patchObj["status"]} for ${altStr} prescription with providerCode: ${providerCode}, initial: ${initial}, date: ${date}.`
    }
}

/**
 * Get a patient prescription
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
 * Delete a prescription
 * This is a generic function where you can then pass main/alt as prescriber/patient or patient/prescriber.
 * 
 * @param {string} type type of prescription to patch. One of PRESCRIPTION_TYPES.
 * @param {Object} search search parameters
 * @returns {string | null} error message if error, else null
 */
export async function deletePrescription(type, search) {
    let mainStr, altStr, searchSchema, mainCollection, altType, altStatus;
    if (type === PRESCRIPTION_TYPES.PRESCRIBER) {
        mainStr = PRESCRIPTION_TYPES.PRESCRIBER;
        altStr = PRESCRIPTION_TYPES.PATIENT;
        searchSchema = adminSinglePrescriberPrescriptionSearchSchema;
        mainCollection = COLLECTIONS.PRESCRIBER_PRESCRIPTIONS;
        altType = PRESCRIPTION_TYPES.PATIENT;
        altStatus = PATIENT_PRESCRIPTION_STATUS;
    }
    // PRESCRIPTION_TYPES.PATIENT
    else {
        mainStr = PRESCRIPTION_TYPES.PATIENT;
        altStr = PRESCRIPTION_TYPES.PRESCRIBER;
        searchSchema = adminSinglePatientPrescriptionSearchSchema;
        mainCollection = COLLECTIONS.PATIENT_PRESCRIPTIONS;
        altType = PRESCRIPTION_TYPES.PRESCRIBER;
        altStatus = PRESCRIBER_PRESCRIPTION_STATUS;
    }

    const searchObj = await objWithFields(search, searchSchema);
    const collection = getDb().collection(mainCollection);
    const data = await collection.findOneAndDelete(searchObj);
    if (!data) {
        return `Error deleting ${mainStr} prescription with providerCode: ${searchObj.providerCode}, initial: ${searchObj.initial}, date: ${searchObj.date}`;
    }

    // Update corresponding alt prescription to not logged status
    const res = await patchSinglePrescription(
        altType,
        searchObj.providerCode,
        searchObj.initial,
        searchObj.date,
        data.prescribed,
        { status: altStatus.NOT_LOGGED }
    )
    return res;
}
