/**
 * This file defines the routes for an admin (coordinator + assistant)
 */

import express from "express";
import {
    getAdminPaginatedPrescriberPrescription,
    getAdminSinglePatientPrescription,
    getAdminSinglePrescriberPrescription,
    getPaginatedPrescriber,
    patchSinglePrescriber,
    patchSinglePrescription,
    deletePrescription,
    addSinglePrescriber
} from "../database/adminServiceDbUtils.js";
import { adminPrescriberPrescriptionPatchSchema } from "../schemas.js";
import { PATIENT_PRESCRIPTION_STATUS, PRESCRIBER_PRESCRIPTION_STATUS } from "../types/prescriptionTypes.js";
import { PRESCRIPTION_TYPES } from "../constants.js";

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

adminRouter.post("/addPrescriber", express.json(), async (req, res) => {
    try {
        const { prescriber } = req.body;
        console.log(prescriber);

        if (prescriber === null) {
            return res.status(400).json({ error: "A prescriber object must be provided." });
        }

        if (prescriber.firstName === "" || prescriber.lastName === "" || prescriber.province === "" || prescriber.licensingCollege === "" || prescriber.licenceNumber === "") {
            return res.status(400).json({ error: "missing fields" });
        }

        let addedPrescriber = await addSinglePrescriber(prescriber);
        if (addedPrescriber.data) {
            return res.status(200).json({ data: addedPrescriber.data });
        } else {
            return res.status(401).json({ error: addedPrescriber.error });
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
adminRouter.post("/getAdminPaginatedPrescriberPrescription", express.json(), async (req, res) => {
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
 * Get a single prescriber prescription.
 *
 * Needs to be authorized (use middleware adminRoute).
 *
 * Expected body: {
 *  search: Object
 * }
 *
 * Response: { prescription: PrescriberPrescription } | {error: String}
 * Response Status: 200 - OK, else error
 */
adminRouter.post("/getAdminSinglePrescriberPrescription", express.json(), async (req, res) => {
    try {
        const { search } = req.body;

        const ret = await getAdminSinglePrescriberPrescription(search);

        if (!ret) {
            return res.status(404).json({ error: `Failed to find prescriber prescription with providerCode: ${search.providerCode}, initial: ${search.initial}, date: ${search.date}` });
        }
        return res.status(200).json({ prescription: ret });
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
 *  prescribed: Boolean
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
        const { providerCode, initial, date, prescribed, patches } = req.body;

        if ([providerCode, initial, date, prescribed, patches].some(ele => ele === null) || [providerCode, initial, date].some(ele => ele === "")) {
            return res.status(400).json({ error: "A providerCode, initial, date, prescribed, and patches object must be provided and non-empty." });
        }

        const patchError = await patchSinglePrescription(
            PRESCRIPTION_TYPES.PRESCRIBER,
            providerCode,
            initial,
            date,
            prescribed,
            patches,
        )
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
 * Delete a single prescriber prescription.
 *
 * Needs to be authorized (use middleware adminRoute).
 *
 * Expected body: {
 *  search: Object
 * }
 *
 * Response: { message: String } | {error: String}
 * Response Status: 200 - OK, else error
 */
adminRouter.post("/deletePrescriberPrescription", express.json(), async (req, res) => {
    try {
        const { search } = req.body;

        const delError = await deletePrescription(PRESCRIPTION_TYPES.PRESCRIBER, search);

        if (delError) {
            return res.status(404).json({ error: delError });
        }
        return res.status(200).json({ message: `Successfully deleted prescriber prescription with providerCode: ${search.providerCode}, initial: ${search.initial}, date: ${search.date}.` });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

/**
 * Get a single patient prescription.
 *
 * Needs to be authorized (use middleware adminRoute).
 *
 * Expected body: {
 *  search: Object
 * }
 *
 * Response: { prescription: PatientPrescription } | {error: String}
 * Response Status: 200 - OK, else error
 */
adminRouter.post("/getAdminSinglePatientPrescription", express.json(), async (req, res) => {
    try {
        const { search } = req.body;

        const ret = await getAdminSinglePatientPrescription(search);

        if (!ret) {
            return res.status(404).json({ error: `Failed to find patient prescription with providerCode: ${search.providerCode}, initial: ${search.initial}, date: ${search.date}` });
        }
        return res.status(200).json({ prescription: ret });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})