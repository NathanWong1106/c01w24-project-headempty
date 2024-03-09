import { COLLECTIONS } from "../constants.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin, Patient, Prescriber } from "../types/userServiceTypes.js";
import { getDb } from "./dbConnection.js";
import { ObjectId } from "mongodb";

/**
 * Tries to login an admin user with the given email and password.
 * Returns the admin response object if successful, else null.
 * 
 * @param {string} email user email
 * @param {string} password  password
 * @returns {Admin | null}
 */
export async function tryLoginAdmin(email, password) {
    const data = await getUserFromCollectionWithPassword(email, password, getDb().collection(COLLECTIONS.ADMINS));

    if (data) {
        const { email, accountType } = data;
        const admin = new Admin(accountType, email, "");
        const token = jwt.sign({ admin }, process.env.JWT_SECRET, { expiresIn: "1h" });

        admin.token = token;
        return admin;
    } else {
        return null;
    }
}

/**
 * Tries to login a patient user with the given email and password.
 * Returns the patient response object if successful, else null.
 * 
 * @param {string} email user email
 * @param {string} password  password
 * @returns {Patient | null}
 */
export async function tryLoginPatient(email, password) {
    const data = await getUserFromCollectionWithPassword(email, password, getDb().collection(COLLECTIONS.PATIENT));

    if (data) {
        const { email, firstName, lastName, language, city, province, address } = data;
        const patient = new Patient(email, "", firstName, lastName, language, city, province, address);
        const token = jwt.sign({ patient }, process.env.JWT_SECRET, { expiresIn: "1h" });

        patient.token = token;
        return patient;
    } else {
        return null;
    }
}

/**
 * Tries to login a prescriber user with the given email and password.
 * Returns the prescriber response object if successful, else null.
 * 
 * @param {string} email user email
 * @param {string} password  password
 * @returns {Prescriber | null}
 */
export async function tryLoginPrescriber(email, password) {
    const data = await getUserFromCollectionWithPassword(email, password, getDb().collection(COLLECTIONS.PRESCRIBER));

    if (data) {
        const { email, firstName, lastName, language, city, province, address, profession, providerCode, licensingCollege, licenceNumber, registered } = data;

        //This could be a prescriber stub, if so, don't allow login
        if (!registered) {
            console.log(data)
            return null;
        }

        const prescriber = new Prescriber(email, "", firstName, lastName, language, city, province, address, profession, providerCode, licensingCollege, licenceNumber, registered)
        const token = jwt.sign({ prescriber }, process.env.JWT_SECRET, { expiresIn: "1h" });

        prescriber.token = token;
        return prescriber;
    } else {
        return null;
    }
}

/**
 * @param {string} email email 
 * @param {string} password password
 * @param {Db.collection} collection user collection
 * @returns the user document from the collection if the email and password match.
 * Else, returns null.
 */
async function getUserFromCollectionWithPassword(email, password, collection) {
    const data = await collection.findOne({
        email: email,
    })

    if (data && await bcrypt.compare(password, data.password)) {
        return data;
    } else {
        return null;
    }
}

/**
 * Tries to register a prescriber user with the given prescriber Id.
 * Returns the prescriber response object if successful, else null.
 * 
 * @param {ObjectId} prescriberId  prescriber Id
 * @returns {Prescriber | null}
 */
export async function tryRegisterPrescriber(prescriberId) {
    const data = await getPrescriberFromCollectionWithId(prescriberId);

    if (data) {
        const { email, firstName, lastName, language, city, province, address, profession, providerCode, licensingCollege, licenceNumber, registered } = data;
        return new Prescriber(email, "", firstName, lastName, language, city, province, address, profession, providerCode, licensingCollege, licenceNumber, registered)
    } 
    return null;
}

/**
 * @param {ObjectId} prescriberId prescriber ID
 * @returns the prescriber document from the collection with the corresponding ID.
 * Else, returns null.
 */
export async function getPrescriberFromCollectionWithId(prescriberId) {
    const data = await getDb().collection(COLLECTIONS.PRESCRIBER).findOne({
        _id: prescriberId
    });
    if (!data) {
        return null
    }
    return data
}

