import { getDb } from "./dbConnection.js";

export const prescriptionFields = ["Prescription Date", "Patient Initials", "Provider Code", "Prescriber Email", "Description"];

export async function patchSinglePrescription(providerCode, patches) {
    const patchObj = objWithFields(prescriptionFields, patches);
    const collection = getDb().collection(COLLECTIONS.PRESCRIBER_PRESCRIPTIONS);
    const data = await collection.updateOne({ providerCode: providerCode }, { $set: patchObj });

    return data.matchedCount === 1;
}