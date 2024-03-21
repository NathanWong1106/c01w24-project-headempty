/**
 * This file defines the routes for an patient
 */

import express from "express";
import { getPaginatedPatientPrescription } from "../database/patientServiceDbUtils.js";
export const patientRouter = express.Router();

/**
 * Get a paginated list of all prescriptions for a patient.
 * 
 * Needs to be authorized (use middleware patientRoute).
 * 
 * Expected body: {
 *  page: Number (1-indexed)
 *  pageSize: Number
 *  search: Object
 * }
 * 
 * Response: { list: PatientPrescription[] } | {error: String}
 * Response Status: 200 - OK, else error
 */
patientRouter.post("/getPaginatedPrescriptions", express.json(), async (req, res) => {
    try {
        const { page, pageSize, search } = req.body;

        if (page === null || pageSize === null) {
            return res.status(400).json({ error: "A page, pageSize, and optional search object must be provided." });
        }

        if (page < 1 || pageSize < 1) {
            return req.status(400).json({ error: "A valid page and pageSize must be provided." })
        }

        const retList = await getPaginatedPatientPrescription(page, pageSize, search);

        return res.status(200).json({ list: retList });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})