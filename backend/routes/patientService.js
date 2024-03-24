/**
 * This file defines the routes for an patient
 */

import express from "express";
import { getPaginatedPatientPrescription } from "../database/patientServiceDbUtils.js";
import { getMatchingPrescriberPrescription, patchPrescriberPrescriptionStatus } from "../database/prescriberServiceDbUtils.js";
export const patientRouter = express.Router();


/**
 * Sends a single prescription to the server.
 * @param {string} providerCode - The provider code.
 * @param {string} prscn_date - The date of the prescription.
 * @param {string} patientInit - The patient's initials.
 * @param {boolean} checked - Whether the prescription has been checked.
 * @param {Array} postObj - The prescription post details.
 * @returns {Promise<ApiResponse>} The response object from the API call.
 */
patientRouter.post("/postPrescription", express.json(), async (req, res) => {
    try {
        const { providerCode, prscn_date, patientInit, checked, postObj } = req.body;
        if (providerCode === "" || prscn_date === "" || patientInit === ""|| postObj === null) {
            return res.status(400).json({ error: "All required fields must be provided" });
        }

        //checking if there is a matching prescription logged by a patient
        const match = await getMatchingPrescriberPrescription(providerCode, prscn_date, patientInit);
        if (match[0] === true) {
            console.log("Match found");
            if (checked) {
                postObj["status"] = PRESCRIBER_PRESCRIPTION_STATUS.LOGGED;
    
            } else {
                postObj["status"] = PRESCRIBER_PRESCRIPTION_STATUS.COMPLETE;
            }
            //updating patient status as well
            await patchPrescriberPrescriptionStatus(match[1], postObj["status"]);
        }

        //actually posting the new prescription for the prescriber, now with the status
        const ret = await postSinglePrescription(providerCode, postObj);
        if (ret){
            return res.status(200).json({ message: `Successfully added prescription. Refresh page to see changes.`});
        }
        return res.status(404).json({ error: `Failed to add prescription` });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});




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
