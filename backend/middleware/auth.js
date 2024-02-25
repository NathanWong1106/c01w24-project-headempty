import jwt from "jsonwebtoken"
import { ACCOUNT_TYPE } from "../types/userServiceTypes.js"

export const coordinatorRoute = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        try {
            user = user.admin;
            if (!user || err || !user.accountType || user.accountType != ACCOUNT_TYPE.COORDINATOR) 
                return res.sendStatus(403);
            req.user = user;
            next();
        } catch (err) {
            return res.sendStatus(500);
        }
    })
}

export const adminRoute = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        try {
            user = user.admin;
            if (!user || err || !user.accountType || (user.accountType != ACCOUNT_TYPE.COORDINATOR && user.accountType != ACCOUNT_TYPE.ASSISTANT)) 
                return res.sendStatus(403);
            req.user = user;
            next();
        } catch (err) {
            return res.sendStatus(500);
        }
    })
}

export const prescriberRoute = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        try {
            user = user.prescriber;
            if (!user || err || !user.accountType || user.accountType != ACCOUNT_TYPE.PRESCRIBER) 
                return res.sendStatus(403);
            req.user = user;
            next();
        } catch (err) {
            return res.sendStatus(500);
        }
    })
}

export const patientRoute = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        try {
            user = user.patient;
            if (!user || err || !user.accountType || user.accountType != ACCOUNT_TYPE.PATIENT) 
                return res.sendStatus(403);
            req.user = user;
            next();
        } catch (err) {
            return res.sendStatus(500);
        }
    })
}

