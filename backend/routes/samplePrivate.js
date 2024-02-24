import express from "express";
export const privateRouter = express.Router();

/**
 * This is a simple private route. 
 * Returns the user object we get from the token.
 * 
 * When we use the auth middleware, the user is passed
 * to us through req.user
 */
privateRouter.get('/test', express.json(), (req, res) => {
    return res.status(200).json(req.user);
});