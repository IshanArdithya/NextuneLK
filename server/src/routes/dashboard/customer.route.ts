import express from "express";
import * as CustomerController from "../../controllers/customer.controller.js";

const router = express.Router();

router.get("/", CustomerController.getAllCustomers);
router.get("/:id", CustomerController.getCustomerById);
router.get("/:id/deletion-stats", CustomerController.getDeletionStats);
router.put("/:id", CustomerController.updateCustomer);
router.delete("/:id", CustomerController.deleteCustomer);

export default router;
