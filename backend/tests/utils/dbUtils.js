import { MongoClient, Db } from "mongodb";
import { COLLECTIONS, SERVER } from "../../constants.js"
import { genericPatient, genericPrescriber, coordinator, assistant, genericPrescriberPrescription, genericPatientPrescription } from "./sampleData.js"
import { retryPromiseWithDelay } from "../../utils.js";
import bcrypt from "bcryptjs"

const client = new MongoClient(SERVER.MONGO_URL);

/**
 * @type {Db}
 */
let db;

/**
 * Clear documents for all collections.
 * 
 * Implicitly creates the necessary collections if they
 * do not already exist.
 */
export const clearDB = async (clearAdmins = true, clearPrescribers = true, clearPatient = true, clearPatientPrescription = true, clearPrescriberPrescription = true) => {
    clearAdmins && await db.collection(COLLECTIONS.ADMINS).deleteMany({});
    clearPrescribers && await db.collection(COLLECTIONS.PRESCRIBER).deleteMany({});
    clearPatient && await db.collection(COLLECTIONS.PATIENT).deleteMany({});
    clearPatientPrescription && await db.collection(COLLECTIONS.PATIENT_PRESCRIPTIONS).deleteMany({});
    clearPrescriberPrescription && await db.collection(COLLECTIONS.PRESCRIBER_PRESCRIPTIONS).deleteMany({});
}

/**
 * Connect to the db.
 */
export const connect = async () => {
    try {
        await client.connect();
        db = client.db(SERVER.DB_NAME);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

/**
 * Close connection.
 */
export const closeConn = async () => {
    await client.close();
}

/**
 * Inserts the default coordinator and assistant into the admin collection.
 */
export const insertAdmins = async () => {
    await db.collection(COLLECTIONS.ADMINS).insertOne(await cryptPassword(coordinator));
    await db.collection(COLLECTIONS.ADMINS).insertOne(await cryptPassword(assistant));
}

/**
 * Inserts a patient to the db. If modifier is empty then inserts genericPatient.
 * Else, overwrites the specified fields in genericPatient with the values in 
 * modifier then inserts the modified patient.
 * 
 * Returns the patient that was inserted.
 * @param {Object} modifier optional object to overwrite values in genericPatient .
 * @returns {Object} the patient that was inserted.
 */
export const insertPatient = async (modifier = {}) => {
    let patient = await cryptPassword(objWithModifier(genericPatient, modifier));
    await db.collection(COLLECTIONS.PATIENT).insertOne(patient);
    return patient;
}

/**
 * Inserts a prescriber to the db. If modifier is empty then inserts genericPrescriber.
 * Else, overwrites the specified fields in genericPrescriber with the values in 
 * modifier then inserts the modified prescriber.
 * 
 * Returns the prescriber that was inserted.
 * @param {Object} modifier optional object to overwrite values in genericPrescriber .
 * @returns {Object} the prescriber that was inserted.
 */
export const insertPrescriber = async (modifier = {}) => {
    let prescriber = await cryptPassword(objWithModifier(genericPrescriber, modifier));
    await db.collection(COLLECTIONS.PRESCRIBER).insertOne(prescriber);
    return prescriber;
}

/**
 * Insert numPrescribers prescribers into the db. 
 * Each prescriber is generated from the generic prescriber format
 * with incrementing email "prescriber{i}@gmail.com" and 
 * padded providerCode "ON-JC{i}"
 * @param {number} numPrescribers 
 */
export const insertPrescribers = async (numPrescribers = 20) => {
    for (let i = 1; i <= numPrescribers; i++) {
        const modifier = {
            email: `prescriber${i}@gmail.com`,
            providerCode: `ON-JC${String(i).padStart(3, '0')}`
        }
        await insertPrescriber(modifier);
    }
}

/**
 * Finds a prescriber with the corresponding fields
 * 
 * Returns the id of the prescriber
 * @returns {String} the id of the prescriber
 */
export const findPrescriberId = async (prescriber) => {
    const data = await retryPromiseWithDelay(db.collection(COLLECTIONS.PRESCRIBER).findOne(prescriber));
    if (!data) {
        return ""
    }
    return data._id;
}

/**
 * Inserts a prescriber Prescription to the db. If modifier is empty then inserts genericPrescriberPrescription.
 * Else, overwrites the specified fields in genericPrescriberPrescription with the values in 
 * modifier then inserts the modified prescriberPrescription.
 * 
 * Returns the prescriberPrescription that was inserted.
 * @param {Object} modifier optional object to overwrite values in genericPrescriberPrescription .
 * @returns {Object} the prescriberPrescription that was inserted.
 */
export const insertPrescriberPrescription = async (modifier = {}) => {
    let prescriberPrescription = await objWithModifier(genericPrescriberPrescription, modifier);
    await db.collection(COLLECTIONS.PRESCRIBER_PRESCRIPTIONS).insertOne(prescriberPrescription);
    return prescriberPrescription;
}

/**
 * Insert numPrescribersPrescription prescribers into the db. 
 * Each prescriber Prescription is generated from the generic prescriber Prescription Prescriptionat
 * with incrementing date "2024-12-{i}" and 
 * padded providerCode "ON-JC001"
 * @param {number} numPrescriberPrescriptions 
 */
export const insertPrescriberPrescriptions = async (numPrescriberPrescriptions = 20) => {
    for (let i = 1; i <= numPrescriberPrescriptions; i++) {
        const modifier = {
            date: `2024-12-${i}`
        }
        await insertPrescriberPrescription(modifier);
    }
}

/**
 * Inserts a patient Prescription to the db. If modifier is empty then inserts genericPatientPrescription.
 * Else, overwrites the specified fields in genericPatientPrescription with the values in 
 * modifier then inserts the modified patientPrescription.
 * 
 * Returns the patientPrescription that was inserted.
 * @param {Object} modifier optional object to overwrite values in genericPatientPrescription .
 * @returns {Object} the patientPrescription that was inserted.
 */
export const insertPatientPrescription = async (modifier = {}) => {
    let patientPrescription = await objWithModifier(genericPatientPrescription, modifier);
    await db.collection(COLLECTIONS.PATIENT_PRESCRIPTIONS).insertOne(patientPrescription);
    return patientPrescription;
}

/**
 * Insert numPatientPrescriptions patient prescriptions into the db. 
 * Each patient Prescription is generated from the generic patient prescription.
 * with incrementing date "2024-12-{i}" and 
 * padded providerCode "ON-JC001"
 * @param {number} numPatientPrescriptions 
 */
export const insertPatientPrescriptions = async (numPatientPrescriptions = 20) => {
    for (let i = 1; i <= numPatientPrescriptions; i++) {
        const modifier = {
            date: `2024-12-${i}`
        }
        await insertPatientPrescription(modifier);
    }
}

/**
 * Returns a clone of obj with the KVP's specified in opts
 * copied to obj.
 * @param {Object} obj the original object
 * @param {Object} modifier the modifier KVP's
 * @returns {Object}
 */
const objWithModifier = (obj, modifier) => {
    let clone = { ...obj };
    Object.keys(modifier).forEach(key => {
        clone[key] = modifier[key];
    });
    return clone;
}

/**
 * Return a clone of the given object with password field encrypted
 * @param {Object} obj 
 * @returns {Object}
 */
const cryptPassword = async (obj) => {
    let clone = { ...obj };
    clone.password = await bcrypt.hash(obj.password, 10);
    return clone;
}