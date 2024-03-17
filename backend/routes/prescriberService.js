import express from "express";
import { patchSinglePrescription } from "../database/prescriberServiceDbUtils";

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
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})