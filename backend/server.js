import express from "express";
import cors from "cors";
import { SERVER } from "./constants.js";
import { userRouter } from "./routes/userService.js";
import dotenvx from "@dotenvx/dotenvx";
import { privateRouter } from "./routes/samplePrivate.js";
import { adminRoute, coordinatorRoute, patientRoute, prescriberRoute } from "./middleware/auth.js";
import { connectToMongo } from "./database/dbConnection.js";
import { adminRouter } from "./routes/adminService.js";
import { prescriberRouter } from "./routes/prescriberService.js";
import { verificationRouter } from "./routes/verificationService.js";
import { patientRouter } from "./routes/patientService.js";
import { coordinatorRouter } from "./routes/coordinatorService.js";

// Give this process an identifiable name so we can kill it
// after jest tests run.
process.title = "server";

const app = express();

// Get .env
dotenvx.config();

// Initialize dbConnection.js
await connectToMongo();

// Open Port
app.listen(SERVER.PORT, () => {
  console.log(`Server is running on http://localhost:${SERVER.PORT}`);
});

// Cors and register all services
app.use(cors());

// User service - handles registration, login, etc
app.use("/user", userRouter); 

// Admin service
app.use("/admin", adminRoute, adminRouter);

// Coordinator service
app.use("/coordinator", coordinatorRoute, coordinatorRouter);

// Prescriber service
app.use("/prescriber", prescriberRoute, prescriberRouter);

// Patient service
app.use("/patient", patientRoute, patientRouter);

// Prescriber Verification service
app.use("/verification", adminRoute, verificationRouter);

// Example endpoint that only accepts prescribers
app.use("/private", prescriberRoute, privateRouter); 

// Basic test endpoint
app.get("/ping", express.json(), async (req, res) => {
  return res.json({ response: "pong" });
});
