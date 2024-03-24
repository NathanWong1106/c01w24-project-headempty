/* Utility to insert some sample data into local DB for development. */

import { connect, closeConn, insertAdmins, insertPatients, insertPrescribers, insertPatientPrescriptions, insertPrescriberPrescriptions, clearDB } from '../utils/dbUtils.js'

await connect();
await clearDB();
await insertAdmins();
await insertPatients(45);
await insertPrescribers(45);
await insertPatientPrescriptions(45);
await insertPrescriberPrescriptions(45);
await closeConn();