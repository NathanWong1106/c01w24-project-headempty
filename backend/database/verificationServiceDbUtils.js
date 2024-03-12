import { COLLECTIONS } from "../constants.js"
import { getDb } from "./dbConnection.js";
import { prescriberDataSchema } from "../schemas.js";
import { retryPromiseWithDelay } from "../utils.js";

export async function createPrescriber(prescriber) {
    if (!await prescriberDataSchema.isValid(prescriber)) {
        console.error(`Provided prescriber data for ${prescriber.firstName} ${prescriber.lastName} does not match schema.`);
        return false;
    }

    const providerCode = await getAndIncrementProviderCode(prescriber);

    const data = {
        ...prescriber,
        email: "",
        password: "",
        language: "",
        city: "",
        address: "", 
        profession: "",
        providerCode: providerCode,
        registered: false,
    }

    try {
        const collection = getDb().collection(COLLECTIONS.PRESCRIBER);
        await retryPromiseWithDelay(collection.insertOne(data));
        return true;
    } catch (err) {
        console.error(`Unable to insert new prescriber: ${prescriber.firstName} ${prescriber.lastName}`);
        return false;
    }
}

async function getAndIncrementProviderCode(prescriber) {
    const province = prescriber.province;
    const firstInitial = prescriber.firstName.slice(0, 1);
    const lastInitial = prescriber.lastName.slice(0, 1);
    const initials = `${firstInitial}${lastInitial}`;

    const providerCodeNumberCollection = getDb().collection(COLLECTIONS.PROVIDER_CODE_NUMBER);
    const providerCodeNumberSearch = {
        province: province,
        initials: initials,
    }
    const providerCodeNumberDocument = await providerCodeNumberCollection.findOne(providerCodeNumberSearch);

    let providerCodeNumber = null;
    // If none existing with province and initial combination, create with 1
    if (providerCodeNumberDocument) {
        providerCodeNumber = providerCodeNumberDocument.number;
    }
    else {
        providerCodeNumber = 1;
        await retryPromiseWithDelay(providerCodeNumberCollection.insertOne({
            ...providerCodeNumberSearch,
            number: 1
        }));
    }

    const providerCode = `${province}-${initials}${String(providerCodeNumber).padStart(3, "0")}`;
    const prescriberCollection = getDb().collection(COLLECTIONS.PRESCRIBER);
    await retryPromiseWithDelay(prescriberCollection.updateOne(
        prescriber,
        {
            $set: {
                providerCode: providerCode
            }
        }
    ));

    // Increment prescriber code number for this combination
    // NOTE: maybe this could be combined with above using findAndUpdate?
    await retryPromiseWithDelay(providerCodeNumberCollection.updateOne(
        providerCodeNumberSearch,
        {
            $set: {
                number: providerCodeNumber + 1
            }
        }
    ));

    return providerCode;
}

export async function checkIfExistingPrescriber(prescriber) {
    const prescriberCollection = getDb().collection(COLLECTIONS.PRESCRIBER);
    const foundPrescriber = await retryPromiseWithDelay(prescriberCollection.findOne(prescriber));
    return foundPrescriber != null;
}