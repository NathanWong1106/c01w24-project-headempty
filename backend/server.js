import express from "express";
import cors from "cors";
import { SERVER } from "./constants.js";
import { userRouter } from "./routes/userService.js";
import { connectToMongo } from "./database.js";
import dotenvx from "@dotenvx/dotenvx";
import { privateRouter } from "./routes/samplePrivate.js";
import { coordinatorRoute, patientRoute, prescriberRoute } from "./middleware/auth.js";


const app = express();

// Get .env
dotenvx.config();

// Initialize database.js
connectToMongo();

// Open Port
app.listen(SERVER.PORT, () => {
  console.log(`Server is running on http://localhost:${SERVER.PORT}`);
});

// Cors and register all services
app.use(cors());

// User service - handles registration, login, etc
app.use("/user", userRouter); 

// Example endpoint that only accepts prescribers
app.use("/private", prescriberRoute, privateRouter); 

// Basic test endpoint
app.get("/ping", express.json(), async (req, res) => {
  return res.json({ response: "pong" });
});
