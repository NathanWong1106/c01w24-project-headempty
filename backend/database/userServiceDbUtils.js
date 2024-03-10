import { COLLECTIONS } from "../constants.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin, Patient, Prescriber } from "../types/userServiceTypes.js";
import { getDb } from "./dbConnection.js";

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

export async function tryRegisterPatient(email, password, fName, lName, initials, address, city, province, preferredLanguage) {
    return await addPatient(email, password, fName, lName, initials, address, city, province, preferredLanguage);
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

async function addPatient(email, password, fName, lName, initials, address, city, province, preferredLanguage,) {
    try {
        const collection = getDb().collection(COLLECTIONS.PATIENT)
        const existingUser = await collection.findOne({
            email: email,
        })
        if (existingUser) {
            return { data: null, error: "Email already used" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const data = await collection.insertOne({
            email,
            password: hashedPassword,
            firstName: fName,
            lastName: lName,
            language: preferredLanguage,
            initials,
            address,
            city,
            province
        });
        return { data: data, error: null };
    } catch (error) {
        console.error('Error adding patient:', error.message);
        return { data: null, error: error };
    }

}