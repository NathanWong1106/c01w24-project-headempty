import express from "express";
import { tryLoginAdmin, tryLoginPatient, tryLoginPrescriber, tryRegisterPatient } from "../database/userServiceDbUtils.js";
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

userRouter.post("/register", express.json(), async (req, res) => {
    try {
        const { email, password, accountType, fName, lName, initials, address, city, province, preferredLanguage } = req.body;

        let user = null;

        switch (accountType) {
            case ACCOUNT_TYPE.ADMIN:
                break;
            case ACCOUNT_TYPE.PATIENT:
                user = await tryRegisterPatient(email, password, fName, lName, initials, address, city, province, preferredLanguage);
                break;
            case ACCOUNT_TYPE.PRESCRIBER:
                break;
            default:
                return res.status(400).json({ error: "A request to login must contain valid userType, email, and password fields." });
        }

        if (user.data) {
            return res.status(200).json(user.data);
        } else {
            return res.status(401).json({ error: user.error });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})