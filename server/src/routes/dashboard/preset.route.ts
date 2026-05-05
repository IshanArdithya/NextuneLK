import express from "express";
import * as PresetController from "../../controllers/preset.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createPresetSchema, updatePresetSchema } from "../../validations/preset.validation.js";

const router = express.Router();

router.get("/", PresetController.getPresets);
router.get("/all", PresetController.getAllPresets);
router.post("/", validate(createPresetSchema), PresetController.createPreset);
router.put("/:id", validate(updatePresetSchema), PresetController.updatePreset);
router.delete("/:id", PresetController.deletePreset);

export default router;
