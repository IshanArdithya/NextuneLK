import express from "express";
import * as AuthController from "../../controllers/auth.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { finalizeSetupSchema } from "../../validations/auth.validation.js";

const router = express.Router();

router.post("/finalize-setup", validate(finalizeSetupSchema), AuthController.finalizeSetup);

export default router;
