import express from "express";
import { postSinglePrescription, checkMatchingPrescription } from "../database/prescriberServiceDbUtils.js";
import { getPaginatedPrescriberPrescription } from "../database/prescriberServiceDbUtils.js";
export const prescriberRouter = express.Router();



/**
 * Sends a single prescription to the server.
 * @param {string} providerCode - The provider code.
 * @param {Array} patches - The patches to be applied to the prescription.
 * @returns {Promise<ApiResponse>} The response object from the API call.
 */
prescriberRouter.post("/postPrescription", express.json(), async (req, res) => {
    console.log("postPrescription");
    try {
        const { providerCode, patches } = req.body;

        if (providerCode === null || patches === null) {
            return res.status(400).json({ error: "A providerCode and patches object must be provided." });
        }
        const res = await postSinglePrescription(providerCode, patches);

        if (res.status != 200) {
            return res.status(404).json({ error: `Failed to add prescription` });
        }
        return res.status(200).json({ message: `Successfully added prescription. Refresh page to see changes.`});

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});


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