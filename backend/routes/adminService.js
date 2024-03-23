/**
 * This file defines the routes for an admin (coordinator + assistant)
 */

import express from "express";
import { getAdminPaginatedPatientPrescription, getAdminPaginatedPrescriberPrescription, getPaginatedPrescriber, patchSinglePrescriber, patchSinglePrescriberPrescription } from "../database/adminServiceDbUtils.js";

export const adminRouter = express.Router();

/**
 * Get a paginated list of all prescribers.
 * If search is not defined, defaults to no filter.
 * 
 * Needs to be authorized (use middleware adminRoute).
 * 
 * Expected body: {
 *  page: Number (1-indexed)
 *  pageSize: Number
 *  search?: {
 *      email: String?
 *      firstName: String?
 *      lastName: String?
 *      providerCode: String?
 *      licencingCollege: String?
 *      licenceNumber: String?
 *  }
 * }
 * 
 * Response: { list: PrescriberInfo[] } | {error: String}
 * Response Status: 200 - OK, else error
 */
adminRouter.post("/getPaginatedPrescribers", express.json(), async (req, res) => {
    try {
        const { page, pageSize, search = {} } = req.body;

        if (page === null || pageSize === null) {
            return res.status(400).json({ error: "A page, pageSize, and optional search object must be provided." });
        }

        if (page < 1 || pageSize < 1) {
            return req.status(400).json({ error: "A valid page and pageSize must be provided." })
        }

        const retList = await getPaginatedPrescriber(page, pageSize, search);

        return res.status(200).json({ list: retList });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

/**
 * Patch a single prescriber. 
 * Valid fields for patch can be found in adminDbUtils. 
 * Any other fields passed through patches will be ignored.
 * 
 * Needs to be authorized (use middleware adminRoute).
 * 
 * Expected body: {
 *  providerCode: String
 *  patches: {
 *      email: String?
 *      firstName: String?
 *      lastName: String?
 *      language: String? {en | fr}
 *      city: String?
 *      province: String?
 *      profession: String?
 *      licencingCollege: String?
 *      licenceNumber: String?
 *  }
 * 
 * Response: {message: String} | {error: String}
 * Response status: 200 - OK, else error
 * }
 */
adminRouter.patch("/patchPrescriber", express.json(), async (req, res) => {
    try {
        const { providerCode, patches } = req.body;

        if (providerCode === null || patches === null) {
            return res.status(400).json({ error: "A providerCode and patches object must be provided." });
        }

        if (await patchSinglePrescriber(providerCode, patches)) {
            return res.status(200).json({ message: `Successfully patched prescriber with providerCode: ${providerCode}` });
        } else {
            return res.status(404).json({ error: `Failed to find prescriber with providerCode: ${providerCode}` });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

/**
 * Get a paginated list of all prescriber prescriptions.
 * 
 * Needs to be authorized (use middleware adminRoute).
 * 
 * Expected body: {
 *  page: Number (1-indexed)
 *  pageSize: Number
 *  search: Object
 * }
 * 
 * Response: { list: PrescriberPrescription[] } | {error: String}
 * Response Status: 200 - OK, else error
 */
adminRouter.post("/getAdminPaginatedPrescriberPrescriptions", express.json(), async (req, res) => {
    try {
        const { page, pageSize, search } = req.body;

        if (page === null || pageSize === null) {
            return res.status(400).json({ error: "A page, pageSize, and optional search object must be provided." });
        }

        if (page < 1 || pageSize < 1) {
            return req.status(400).json({ error: "A valid page and pageSize must be provided." })
        }

        const retList = await getAdminPaginatedPrescriberPrescription(page, pageSize, search);

        return res.status(200).json({ list: retList });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

/**
 * Patch a single prescriber's prescription. 
 * Valid fields for patch can be found in adminDbUtils. 
 * Any other fields passed through patches will be ignored.
 * 
 * Needs to be authorized (use middleware adminRoute).
 * 
 * Expected body: {
 *  providerCode: String
 *  initial: String
 *  date: String
 *  patches: {
 *      providerCode: String?
 *      date: String?
 *      initial: String?
 *      prescribed: Boolean?
 *      status: String?
 *  }
 * 
 * Response: {message: String} | {error: String}
 * Response status: 200 - OK, else error
 * }
 */
adminRouter.patch("/patchSinglePrescriberPrescription", express.json(), async (req, res) => {
    try {
        const { providerCode, initial, date, patches } = req.body;

        if ([providerCode, initial, date, patches].some(ele => ele === null) || [providerCode, initial, date].some(ele => ele === "")) {
            return res.status(400).json({ error: "A providerCode, initial, date, and patches object must be provided and non-empty." });
        }

        const patchError = await patchSinglePrescriberPrescription(providerCode, initial, date, patches)
        if (!patchError) {
            return res.status(200).json({ message: `Successfully patched prescriber prescription with providerCode: ${providerCode}, initial: ${initial}, date: ${date}.` });
        } else {
            return res.status(404).json({ error: patchError });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

/**
 * Get a paginated list of all patient prescriptions.
 * 
 * Needs to be authorized (use middleware adminRoute).
 * 
 * Expected body: {
 *  page: Number (1-indexed)
 *  pageSize: Number
 *  search: Object
 * }
 * 
 * Response: { list: PrescriberPrescription[] } | {error: String}
 * Response Status: 200 - OK, else error
 */
adminRouter.post("/getAdminPaginatedPatientPrescriptions", express.json(), async (req, res) => {
    try {
        const { page, pageSize, search } = req.body;

        if (page === null || pageSize === null) {
            return res.status(400).json({ error: "A page, pageSize, and optional search object must be provided." });
        }

        if (page < 1 || pageSize < 1) {
            return req.status(400).json({ error: "A valid page and pageSize must be provided." })
        }

        const retList = await getAdminPaginatedPatientPrescription(page, pageSize, search);

        return res.status(200).json({ list: retList });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})