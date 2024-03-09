import express from "express";
import { ObjectId } from "mongodb";
import { tryLoginAdmin, tryLoginPatient, tryLoginPrescriber, tryRegisterPrescriber } from "../database/userServiceDbUtils.js";
import { ACCOUNT_TYPE } from "../types/userServiceTypes.js";
import { COLLECTIONS } from "../constants.js";

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

/**
 * Registration endpoint for all users.
 * 
 * Expected body: {}
 * 
 * Response: Object< Prescriber >
 */
userRouter.post("/registration/prescriber/:prescriberId", express.json(), async(req, res) => {
    try {
        const prescriberId = req.params.prescriberId;
    
        //check if unique prescriber id exists in db, and check if id is valid (extremely special case)    
        if (!ObjectId.isValid(prescriberId) || !((String)(new ObjectId(prescriberId)) === prescriberId)){
            return res.status(400).json({ error: "This is not a valid registration link."})
        }
        preObjId = new ObjectId(prescriberId);
        if (!((String)(preObjId === prescriberId))){
            return res.status(400).json({ error: "This is not a valid registration link."})
        }
        
        //search db for document of corresponding prescriber and check if they have already been registered
        let user = tryRegisterPrescriber(preObjId)
        if (!user) {
            return res.status(401).json({ error: "Unable to find a verified presciber associated with this link."}) 
        } else if (user.registered) {
            return res.status(401).json({ error: "The prescriber associated with this link has already been registered."})
        } else {
            return res.status(200).json(user);
        }
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
});