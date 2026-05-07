import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import compression from "compression";
import { xss } from "express-xss-sanitizer";
import externalApiRoutes from "./routes/externalApi.route.js";
import dashboardRoutes from "./routes/dashboard/index.js";
import { sanitizeData } from "./middleware/sanitize.js";
import { auth } from "./lib/auth.js";
import { toNodeHandler } from "better-auth/node";
import { protectDashboard } from "./middleware/auth.middleware.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";
import { stream } from "./utils/logger.js";
import { generalLimiter, authLimiter } from "./middleware/rateLimiters.js";
import { ClientService } from "./services/client.service.js";

const app = express();

// logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", { stream }));

// trust proxy
if (process.env.TRUST_PROXY === "true" || process.env.TRUST_PROXY === "1") {
  app.set("trust proxy", 1);
} else {
  // fallback to trust first proxy
  app.set("trust proxy", 1);
}

// security & optimization headers
app.use(helmet());
app.use(compression());

const port = process.env.PORT;

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
  : [];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(sanitizeData);

// xss & param pollution
app.use(xss());
app.use(hpp());

// routes

// health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime(), timestamp: new Date() });
});

app.use("/api/auth", authLimiter, toNodeHandler(auth));
app.use("/api/external", generalLimiter, externalApiRoutes);
app.use("/api/admin", protectDashboard, generalLimiter, dashboardRoutes);

// 404 hygiene
app.all(/^\/api\/.*$/, (req, res) => {
  res.status(404).json({ success: false, msg: "API route not found" });
});

// global error handler
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);

  // start background sync
  const SYNC_INTERVAL = parseInt(process.env.SYNC_INTERVAL_MS || "300000");
  console.log(`[System] Background sync enabled (Interval: ${SYNC_INTERVAL}ms)`);

  setInterval(async () => {
    try {
      await ClientService.syncPanelToDb();
    } catch (error) {
      console.error("[Background Sync Error]:", error);
    }
  }, SYNC_INTERVAL);
});
