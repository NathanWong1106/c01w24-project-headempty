import express from "express";
import { ObjectId } from "mongodb";
import { tryLoginAdmin, tryLoginPatient, tryLoginPrescriber, getVerifiedPrescriber, updatePrescriberRegistration, tryRegisterPatient } from "../database/userServiceDbUtils.js";
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

/**
 * Endpoint to find out if a prescriber is verified, and if they are, if they're verified or not
 * 
 * Response: Object< Prescriber >
 */
userRouter.get("/registration/:prescriberId", express.json(), async(req, res) => {
    try {
        const prescriberId = req.params.prescriberId;
    
        //check if unique prescriber id exists in db, and check if id is valid (extremely special case)    
        if (!ObjectId.isValid(prescriberId)){
            return res.status(400).json({ error: "This is not a valid registration link."})
        }
        let preObjId = new ObjectId(prescriberId);
        if (!((String)(preObjId === prescriberId))){
            return res.status(400).json({ error: "This is not a valid registration link."})
        }
        
        //search db for document of corresponding prescriber and check if they have already been registered
        let user = await getVerifiedPrescriber(preObjId)
        if (!user) {
            return res.status(401).json({ error: "Unable to find a verified prescriber associated with this link."}) 
        } else if (user.registered) {
            return res.status(402).json({ error: "The prescriber associated with this link has already been registered."})
        } else {
            return res.status(200).json(user);
        }
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
});

/**
 * Endpoint to edit prescriber to registered status to complete registration
 * 
 * Response: Object< Patch data >
 */
userRouter.patch("/registration/prescriber", express.json(), async(req, res) => {
    try {
        const {_id, email, password, language} = req.body;
        
        if (!email || !password || !language) {
            return res.status(400).json({ error: "Please fill out all fields"})
        }

        if (!ObjectId.isValid(_id)){
            return res.status(401).json({ error: "This is not a verified prescriber."})
        }
        let preObjId = new ObjectId(_id);
        if (!((String)(preObjId === _id))){
            return res.status(401).json({ error: "This is not a verified prescriber."})
        }
        
        let data = await updatePrescriberRegistration(preObjId, email, password, language);
        if (data.error) {
            return res.status(404).json({error: data.error})
        } else {
            return res.status(200).json(data)
        }
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
});

userRouter.post("/register/patient", express.json(), async (req, res) => {
    try {
        const { email, password, accountType, fName, lName, initials, address, city, province, preferredLanguage } = req.body;

        // Check if any required field is null
        const requiredFields = ['email', 'password', 'accountType', 'fName', 'lName', 'initials', 'address', 'city', 'province', 'preferredLanguage'];
        if (requiredFields.some((field) => field.body == null) {
            return res.status(400).json({ error: `${field} is required.` });
        }

        let user = null;

        if (accountType === ACCOUNT_TYPE.PATIENT) {
            user = await tryRegisterPatient(email, password, fName, lName, initials, address, city, province, preferredLanguage);
        } else {
            return res.status(400).json({ error: "Account type is not Patient" });
        }

        if (user.data) {
            return res.status(200).json({ data: user.data });
        } else {
            return res.status(401).json({ error: user.error });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})