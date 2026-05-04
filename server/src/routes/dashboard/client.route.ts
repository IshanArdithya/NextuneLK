import express from "express";
import * as ClientController from "../../controllers/client.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { addClientSchema, updateClientSchema, deleteClientSchema } from "../../validations/client.validation.js";

const router = express.Router();

router.post("/add", validate(addClientSchema), ClientController.addClient);
router.put("/update", validate(updateClientSchema), ClientController.updateClient);
router.post("/delete", validate(deleteClientSchema), ClientController.deleteClient);
router.post("/reset-cycle", ClientController.resetClientCycle);

export default router;
