
/**
 * This file defines the routes for an prescriber
 */

import express from "express";
import { patchSinglePrescription } from "../database/prescriberServiceDbUtils";
import { getPaginatedPrescriberPrescription } from "../database/prescriberServiceDbUtils.js";
export const prescriberRouter = express.Router();

      
prescriberRouter.post("/postPrescription", express.json(), async (req, res) => {
    try {
        const { providerCode, patches } = req.body;

        if (providerCode === null || patches === null) {
            return res.status(400).json({ error: "A providerCode and patches object must be provided." });
        }

        if (await patchSinglePrescription(providerCode, patches)) {
            return res.status(200).json({ message: `Successfully patched prescriber with providerCode: ${providerCode}` });
        } else {
            return res.status(404).json({ error: `Failed to find prescriber with providerCode: ${providerCode}` });
        }
/**
 * Get a paginated list of all prescription prescriptions from prescriber.
 * 
 * Needs to be authorized (use middleware prescriberRoute).
 * 
 * Expected body: {
 *  page: Number (1-indexed)
 *  pageSize: Number
 *  search: Object
 * }
 * 
 * Response: { list: PrescirberPrescription[] } | {error: String}
 * Response Status: 200 - OK, else error
 */
prescriberRouter.post("/getPaginatedPrescriptions", express.json(), async (req, res) => {
    try {
        const { page, pageSize, search } = req.body;

        if (page === null || pageSize === null) {
            return res.status(400).json({ error: "A page, pageSize, and optional search object must be provided." });
        }

        if (page < 1 || pageSize < 1) {
            return req.status(400).json({ error: "A valid page and pageSize must be provided." })
        }

        const retList = await getPaginatedPrescriberPrescription(page, pageSize, search);

        return res.status(200).json({ list: retList });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})