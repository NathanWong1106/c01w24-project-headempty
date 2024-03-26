/**
 * This file defines the routes for a coordinator.
 * 
 * A coordinator has higher privileges compared to an assistant admin. 
 * Namely, access to patient information.
 */

import express from "express";
import { getCoordinatorPaginatedPatientPrescription, getPaginatedPatient, patchSinglePatient } from "../database/coordinatorServiceDbUtils.js";
import { patchSinglePrescription, deletePrescription } from "../database/adminServiceDbUtils.js";
import { PRESCRIPTION_TYPES } from "../constants.js";

export const coordinatorRouter = express.Router();

/**
 * Get a paginated list of all patients.
 * If search is not defined, defaults to no filter.
 * 
 * Needs to be authorized (use middleware coordinatorRoute).
 * 
 * Expected body: {
 *  page: Number (1-indexed)
 *  pageSize: Number
 *  search?: {
 *      email: String?
 *      firstName: String?
 *      lastName: String?
*       address: String?
 *      city: String?
 *      province: String?
 *  }
 * }
 * 
 * Response: { list: PatientInfo[] } | {error: String}
 * Response Status: 200 - OK, else error
 */
coordinatorRouter.post("/getPaginatedPatients", express.json(), async (req, res) => {
    try {
        const { page, pageSize, search = {} } = req.body;

        if (page === null || pageSize === null) {
            return res.status(400).json({ error: "A page, pageSize, and optional search object must be provided." });
        }

        if (page < 1 || pageSize < 1) {
            return req.status(400).json({ error: "A valid page and pageSize must be provided." })
        }

        const retList = await getPaginatedPatient(page, pageSize, search);

        return res.status(200).json({ list: retList });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

/**
 * Patch a single patient. 
 * Valid fields for patch can be found in adminDbUtils. 
 * Any other fields passed through patches will be ignored.
 * 
 * Needs to be authorized (use middleware coordinatorRoute).
 * 
 * Expected body: {
 *  email: String
 *  patches: {
 *      firstName: String?
 *      lastName: String?
 *      language: String? {en | fr}
 *      address: String?
 *      city: String?
 *      province: String?
 *  }
 * 
 * Response: {message: String} | {error: String}
 * Response status: 200 - OK, else error
 * }
 */
coordinatorRouter.patch("/patchPatient", express.json(), async (req, res) => {
    try {
        const { email, patches } = req.body;

        if (email === null || patches === null) {
            return res.status(400).json({ error: "An email and patches object must be provided." });
        }

        if (await patchSinglePatient(email, patches)) {
            return res.status(200).json({ message: `Successfully patched patient with email: ${email}` });
        } else {
            return res.status(404).json({ error: `Failed to find patient with email: ${email}` });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

/**
 * Get a paginated list of all patient prescriptions.
 * 
 * Needs to be authorized (use middleware coordinatorRoute).
 * 
 * Expected body: {
 *  page: Number (1-indexed)
 *  pageSize: Number
 *  search: Object
 * }
 * 
 * Response: { list: PatientPrescriptions[] } | {error: String}
 * Response Status: 200 - OK, else error
 */
coordinatorRouter.post("/getCoordinatorPaginatedPatientPrescription", express.json(), async (req, res) => {
    try {
        const { page, pageSize, search } = req.body;

        if (page === null || pageSize === null) {
            return res.status(400).json({ error: "A page, pageSize, and optional search object must be provided." });
        }

        if (page < 1 || pageSize < 1) {
            return req.status(400).json({ error: "A valid page and pageSize must be provided." })
        }

        const retList = await getCoordinatorPaginatedPatientPrescription(page, pageSize, search);

        return res.status(200).json({ list: retList });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

/**
 * Patch a single patient's prescription. 
 * Valid fields for patch can be found in adminDbUtils. 
 * Any other fields passed through patches will be ignored.
 * 
 * Needs to be authorized (use middleware coordinatorRoute).
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
coordinatorRouter.patch("/patchSinglePatientPrescription", express.json(), async (req, res) => {
    try {
        const { providerCode, initial, date, prescribed, patches } = req.body;

        if ([providerCode, initial, date, prescribed, patches].some(ele => ele === null) || [providerCode, initial, date].some(ele => ele === "")) {
            return res.status(400).json({ error: "A providerCode, initial, date, prescribed, and patches object must be provided and non-empty." });
        }

        const patchError = await patchSinglePrescription(
            PRESCRIPTION_TYPES.PATIENT,
            providerCode,
            initial,
            date,
            prescribed,
            patches,
        )
        if (!patchError) {
            return res.status(200).json({ message: `Successfully patched patient prescription with providerCode: ${providerCode}, initial: ${initial}, date: ${date}.` });
        } else {
            return res.status(404).json({ error: patchError });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

/**
 * Delete a single patient prescription.
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
coordinatorRouter.post("/deletePatientPrescription", express.json(), async (req, res) => {
    try {
        const { search } = req.body;

        const delError = await deletePrescription(PRESCRIPTION_TYPES.PATIENT, search);

        if (delError) {
            return res.status(404).json({ error: delError });
        }
        return res.status(200).json({ message: `Successfully deleted patient prescription with providerCode: ${search.providerCode}, initial: ${search.initial}, date: ${search.date}.` });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})