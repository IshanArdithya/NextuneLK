import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import { xss } from "express-xss-sanitizer";
import { rateLimit } from "express-rate-limit";
import { MemoryStore } from "express-rate-limit";
import { connectDB } from "./config/db.js";
import adminRoutes from "./routes/admin.route.js";
import externalApiRoutes from "./routes/externalApi.route.js";
import { sanitizeData } from "./middleware/sanitize.js";

dotenv.config();

const app = express();
// trust the first proxy (Nginx)
app.set("trust proxy", 1);

// security headers
app.use(helmet());

const port = process.env.PORT;

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
  : [];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// sanitize data
app.use(sanitizeData);

// prevent XSS attacks
app.use(xss());

// prevent parameter pollution
app.use(hpp());

connectDB();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "rate_limit_exceeded",
      message: "Too many login attempts, please try again after 15 minutes",
    });
  },
  store: new MemoryStore(),
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "rate_limit_exceeded",
      message: "Too many requests, please try again later",
    });
  },
  store: new MemoryStore(),
});

app.use("/api/admins", authLimiter, adminRoutes);
app.use("/api/external", apiLimiter, externalApiRoutes);

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
