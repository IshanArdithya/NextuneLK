import express from "express";
import {
  getSessionStatus,
  getClientUsage,
} from "../controllers/externalApi.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { getClientUsageSchema } from "../validations/external.validation.js";

const router = express.Router();

router.get("/session-status", getSessionStatus);
router.get("/getUsage/:email", validate(getClientUsageSchema), getClientUsage);

export default router;
