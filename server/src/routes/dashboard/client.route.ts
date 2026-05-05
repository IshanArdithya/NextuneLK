import express from "express";
import * as ClientController from "../../controllers/client.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { addClientSchema, updateClientSchema, deleteClientSchema, linkCustomerSchema, unlinkCustomerSchema } from "../../validations/client.validation.js";

const router = express.Router();

router.post("/add", validate(addClientSchema), ClientController.addClient);
router.put("/update", validate(updateClientSchema), ClientController.updateClient);
router.post("/delete", validate(deleteClientSchema), ClientController.deleteClient);
router.post("/sync", ClientController.syncClients);
router.post("/reset-cycle", ClientController.resetClientCycle);

// customer linking
router.get("/check-email", ClientController.checkCustomerEmail);
router.post("/link", validate(linkCustomerSchema), ClientController.linkCustomer);
router.post("/unlink", validate(unlinkCustomerSchema), ClientController.unlinkCustomer);

export default router;
