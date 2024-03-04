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
 *  page: Number
 *  pageSize: Number
 * }
 * 
 * Response: List <PrescriberInfo>
 */
adminRouter.get("/getPaginatedPrescribers", express.json(), async (req, res) => {
    //TODO
})