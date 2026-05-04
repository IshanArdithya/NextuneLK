import express from "express";
import clientRoutes from "./client.route.js";
import paymentRoutes from "./payment.route.js";
import presetRoutes from "./preset.route.js";
import inboundRoutes from "./inbound.route.js";
import authRoutes from "./auth.route.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/inbounds", inboundRoutes);
router.use("/client", clientRoutes);
router.use("/payments", paymentRoutes);
router.use("/presets", presetRoutes);

export default router;
