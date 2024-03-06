/**
 * This file defines the routes for an prescriber
 */

import express from "express";
import { getPaginatedPrescriberForm } from "../database/prescriberServiceDbUtils.js";
export const prescriberRouter = express.Router();

/**
 * Get a paginated list of all prescription form from prescriber.
 * If search is not defined, defaults to no filter.
 * 
 * Needs to be authorized (use middleware prescriberRoute).
 * 
 * Expected body: {
 *  page: Number (1-indexed)
 *  pageSize: Number
 *  providerCode: String
 * }
 * 
 * Response: { list: PrescirberForm[] } | {error: String}
 * Response Status: 200 - OK, else error
 */
prescriberRouter.post("/getPaginatedForms", express.json(), async (req, res) => {
    try {
        const { page, pageSize, providerCode } = req.body;

        if (page === null || pageSize === null) {
            return res.status(400).json({ error: "A page, pageSize, and providerCode must be provided." });
        }

        if (page < 1 || pageSize < 1) {
            return req.status(400).json({ error: "A valid page and pageSize must be provided." })
        }

        const retList = await getPaginatedPrescriberForm(page, pageSize, providerCode);

        return res.status(200).json({ list: retList });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})