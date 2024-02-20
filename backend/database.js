import { Db, MongoClient } from "mongodb";
import { COLLECTIONS, SERVER } from "./constants.js";

/**
 * The mongodb database object.
 * @type {Db}
 */
let db;

/**
 * Initialize the db object for all database actions.
 * 
 * Call this in server.js to connect to the db.
 * @returns {Db}
 */
export async function connectToMongo() {
    const client = new MongoClient(SERVER.MONGO_URL);

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        db = client.db(SERVER.DB_NAME);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        return null;
    }
}

/**
 * Tries to find an admin user with the given email and password.
 * Returns the document if found, otherwise null.
 * 
 * @param {string} email user email
 * @param {string} password  hashed password
 * @returns {import("mongodb").WithId | null}
 */
export async function tryGetAdmin(email, password) {
    const collection = db.collection(COLLECTIONS.ADMINS);
    const data = await collection.findOne({
        email: email,
        password: password
    })
    return data;
}