/**
 * This file defines the route for the prescriber verification service
 */

import express from "express";
import { verifyPrescribers } from "../functional/verification/verify.js";
import { prescriberDataSchema } from "../schemas.js";

export const verificationRouter = express.Router();



/**
 * Get and update prescriber statuses.
 * 
 * Needs to be authorized (use middleware adminRoute).
 * 
 * Expected body: List of {
 *  firstName: string,
 *  lastName: string,
 *  province: string,
 *  licensingCollege: string,
 *  licenceNumber: string,
 * }
 * 
 * Response: {
 *  verified: List of verified prescribers,
 *  invalid: List of invalid prescribers,
 *  error: List of prescribers that errored when check
 * }
 */
verificationRouter.post("/verifyPrescribers", express.json(), async (req, res) => {
    try {
        const { prescribers } = req.body;

        if (prescribers === undefined) {
            return res.status(400).json({ error: "A request to verify prescribers must have a prescriber field as a list of prescriber data." });
        }

        let validData = true;
        for (const p of prescribers) {
            validData = validData && await prescriberDataSchema.isValid(p);
            if (!validData) break;
        }
        if (!validData) {
            return res.status(400).json({ error: "Some objects within the array of prescriber field do not match the prescriber data schema." });
        }

        const data = await verifyPrescribers(prescribers);
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});