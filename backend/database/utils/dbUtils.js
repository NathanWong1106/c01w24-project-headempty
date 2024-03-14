/**
 * Return the object with only field in fieldsList and 
 * get casted if schema is present
 * 
 * @param {List} fieldsList fetch field of object
 * @param {Object} referenceObj object to be casted
 * @param {Object} schema schema to cast
 * @returns {Object} the input with casted field
 */
export async function objWithFields(fieldsList, referenceObj, schema = null) {
    let obj = {};

    for (let field of fieldsList) {
        if (referenceObj[field]) {
            obj[field] = referenceObj[field];
        }
    }

    if (!schema){
        return obj;
    }
    console.log(obj);

    // Wait for the schema cast to finish before returning the object
    try {
        obj = await schema.cast(obj);
        return obj;
    } catch (error) {
        console.error("Error casting object:", error);
        return null;
    }
}