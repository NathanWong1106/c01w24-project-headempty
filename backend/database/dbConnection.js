import { Db, MongoClient } from "mongodb";
import { SERVER } from "../constants.js";

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
        db = client.db(SERVER.DB_NAME);
        console.log(`Connected to MongoDB on ${SERVER.MONGO_URL} to db ${SERVER.DB_NAME}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        return null;
    }
}

/**
 * Returns the db object. Call connectToMongo() in initialization before this.
 * @returns {Db}
 */
export function getDb() {
    return db;
}