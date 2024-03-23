/**
 * This file defines the routes for a coordinator.
 * 
 * A coordinator has higher privileges compared to an assistant admin. 
 * Namely, access to patient information.
 */

import express from "express";
import { getPaginatedPatient, patchSinglePatient } from "../database/coordinatorServiceDbUtils.js";

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