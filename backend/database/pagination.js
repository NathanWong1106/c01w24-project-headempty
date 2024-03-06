import { FindCursor } from "mongodb";

/**
 * Utility function to help with pagination.
 * @param {FindCursor} cursor The find cursor. Usually obtained with collection.find({...}).
 * @param {Number} page The 1-indexed page number.
 * @param {Number} pageSize The size of one page.
 * @returns {FindCursor} Modified find cursor.
 */
export default function paginate (cursor, page, pageSize) {
    return cursor.limit(pageSize).skip((page - 1) * pageSize);
}