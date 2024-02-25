import express from "express";
import cors from "cors";
import { SERVER } from "./constants.js";
import { userRouter } from "./routes/userService.js";
import { connectToMongo } from "./database.js";

const app = express();

// Initialize database.js
connectToMongo();

// Open Port
app.listen(SERVER.PORT, () => {
  console.log(`Server is running on http://localhost:${SERVER.PORT}`);
});

// Cors and register all services
app.use(cors());
app.use("/user", userRouter); // User service - handles registration, login, etc

// Basic test endpoint
app.get("/ping", express.json(), async (req, res) => {
  return res.json({ response: "pong" });
});
