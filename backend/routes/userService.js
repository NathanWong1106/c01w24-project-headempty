import express from "express";
import { tryGetAdmin } from "../database.js";

export const userRouter = express.Router();

/**
 * Login endpoint for all users.
 * 
 * TODO: currently just a stub, further implementation needed.
 */
userRouter.post("/login", async (req, res) => {
    try {
        if (await tryGetAdmin("parxadmin@gmail.com", "1234")) {
            return res.status(200).json({ res: "SUCCESS! " });
        }

        return res.status(401).json({ error: "No user found" });
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})