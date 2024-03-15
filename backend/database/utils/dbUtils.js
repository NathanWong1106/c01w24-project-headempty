/**
 * Return the object with only field in fieldsList and 
 * get casted if schema is present
 * 
 * @param {Object} referenceObj object to be casted
 * @param {Object} schema schema to cast
 * @returns {Object} the input with casted field
 */
export async function objWithFields(referenceObj, schema = null) {
    let obj = {};

    if (!schema){
        return obj;
    }

    // Wait for the schema cast to finish before returning the object
    try {
        obj = await schema.cast(referenceObj, { noUnknown: true });
        return obj;
    } catch (error) {
        console.error("Error casting object:", error);
        return null;
    }
}