/**
 * This file defines the routes for an admin (coordinator + assistant)
 */

import express from "express";
import { getPaginatedPrescriber } from "../database/adminServiceDbUtils.js";

export const adminRouter = express.Router();

/**
 * Get a paginated list of all prescribers.
 * 
 * Needs to be authorized (use middleware adminRoute).
 * 
 * Expected body: {
 *  page: Number (1-indexed)
 *  pageSize: Number
 *  search: {
 *      email: String?
 *      firstName: String?
 *      lastName: String?
 *      providerCode: String?
 *      licensingCollege: String?
 *      licenseNumber: String?
 *  }
 * }
 * 
 * Response: { list: PrescriberInfo[] }
 */
adminRouter.get("/getPaginatedPrescribers", express.json(), async (req, res) => {
    try {
        const { page, pageSize, search } = req.body;

        const retList = await getPaginatedPrescriber(page, pageSize, search);

        return res.status(200).json({ list: retList });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})