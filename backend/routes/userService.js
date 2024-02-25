import express from "express";
import { tryLoginAdmin, tryLoginPatient, tryLoginPrescriber } from "../database.js";
import { ACCOUNT_TYPE } from "../types/userServiceTypes.js";
export const userRouter = express.Router();

/**
 * Login endpoint for all users.
 * 
 * Expected body: {
 *  accountType: "admin | patient | prescriber",
 *  email: string
 *  password: string
 * }
 * 
 * Response: Object< Admin | Patient | Prescriber >
 */
userRouter.post("/login", express.json(), async (req, res) => {
    try {
        const { accountType, email, password } = req.body;
        let user = null;

        switch (accountType) {
            case ACCOUNT_TYPE.ADMIN:
                user = await tryLoginAdmin(email, password);
                break;
            case ACCOUNT_TYPE.PATIENT:
                user = await tryLoginPatient(email, password);
                break;
            case ACCOUNT_TYPE.PRESCRIBER:
                user = await tryLoginPrescriber(email, password);
                break;
            default:
                return res.status(400).json({ error: "A request to login must contain valid userType, email, and password fields." });
        }

        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(401).json({ error: `Could not login as ${accountType}. ` });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})