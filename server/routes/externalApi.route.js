import express from "express";
import {
  getSessionStatus,
  getClientUsage,
} from "../controllers/externalApi.controller.js";

const router = express.Router();

router.get("/session-status", getSessionStatus);
router.get("/getUsage/:email", getClientUsage);
// router.get("/logout", logout);

export default router;
