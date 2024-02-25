import { MongoClient, Db } from "mongodb";
import { COLLECTIONS, SERVER } from "../../constants.js"
import { ACCOUNT_TYPE } from "../../types/userServiceTypes.js";
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
export const clearDB = async () => {
    await db.collection(COLLECTIONS.ADMINS).deleteMany({});
    await db.collection(COLLECTIONS.PATIENT).deleteMany({});
    await db.collection(COLLECTIONS.PRESCRIBER).deleteMany({});
    await db.collection(COLLECTIONS.PATIENT_PRESCRIPTIONS).deleteMany({});
    await db.collection(COLLECTIONS.PRESCRIBER_PRESCRIPTIONS).deleteMany({});
}

/**
 * Connect to the db.
 */
export const connect = async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

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
 * Inserts a patient to the db. If options is empty then inserts genericPatient.
 * Else, overwrites the specified fields in genericPatient with the values in 
 * options then inserts the modified patient.
 * 
 * Returns the patient that was inserted.
 * @param {Object} options optional object to overwrite values in genericPatient .
 * @returns {Object} the patient that was inserted.
 */
export const insertPatient = async (options = {}) => {
    let patient = await cryptPassword(objWithOpts(genericPatient, options));
    await db.collection(COLLECTIONS.PATIENT).insertOne(patient);
    return patient;
}

/**
 * Inserts a prescriber to the db. If options is empty then inserts genericPrescriber.
 * Else, overwrites the specified fields in genericPrescriber with the values in 
 * options then inserts the modified prescriber.
 * 
 * Returns the prescriber that was inserted.
 * @param {Object} options optional object to overwrite values in genericPrescriber .
 * @returns {Object} the prescriber that was inserted.
 */
export const insertPrescriber = async (options = {}) => {
    let prescriber = await cryptPassword(objWithOpts(genericPrescriber, options));
    await db.collection(COLLECTIONS.PRESCRIBER).insertOne(prescriber);
    return prescriber;
}

export const defaultPassword = "1234";

export const defaultPasswordCrypt = "$2a$10$bN/Rprp1rQMsISxOlSo.6.scpevmWcCZXKt2zsAna8Pi72k41kuQS";

export const coordinator = {
    "email": "parxadmin@gmail.com",
    "password": defaultPassword,
    "accountType": ACCOUNT_TYPE.COORDINATOR
};

export const assistant = {
    "email": "parxassistant@gmail.com",
    "password": defaultPassword,
    "accountType": ACCOUNT_TYPE.ASSISTANT
};

export const genericPatient = {
    "email": "patient1@gmail.com",
    "password": defaultPassword,
    "firstName": "John",
    "lastName": "Cena",
    "language": "en",
    "city": "Toronto",
    "province": "ON",
    "address": "1254 Military Trail"
};

export const genericPrescriber = {
    "licensingCollege": "licensing college",
    "licenseNumber": "license number 1234",
    "profession": "therapist",
    "providerCode": "ON-JC-1",
    "email": "prescriber1@gmail.com",
    "password": defaultPassword,
    "firstName": "John",
    "lastName": "Cena",
    "language": "en",
    "city": "Toronto",
    "province": "ON",
    "address": "1254 Military Trail"
};

/**
 * Returns a clone of obj with the KVP's specified in opts
 * copied to obj.
 * @param {Object} obj the original object
 * @param {Object} opts the modifier KVP's
 * @returns {Object}
 */
const objWithOpts = (obj, opts) => {
    let clone = { ...obj };
    Object.keys(opts).forEach(key => {
        clone[key] = opts[key];
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