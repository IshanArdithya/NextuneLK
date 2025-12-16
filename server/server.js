import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { MemoryStore } from "express-rate-limit";
import { connectDB } from "./config/db.js";
import adminRoutes from "./routes/admin.route.js";
import externalApiRoutes from "./routes/externalApi.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());
connectDB();

const dataRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  handler: (req, res) => {
    res.status(429).json({
      error: "rate_limit",
      message: "Too many requests - please try again in a minute",
      retryAfter: 60,
    });
  },
  store: new MemoryStore(),
  skip: (req) => req.method !== "GET",
  keyGenerator: (req) => req.ip,
});

app.use("/api/admins", dataRateLimiter, adminRoutes);
app.use("/api/external", dataRateLimiter, externalApiRoutes);

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
