import express from "express";
import * as CustomerController from "../../controllers/customer.controller.js";

const router = express.Router();

router.get("/", CustomerController.getAllCustomers);
router.get("/:id", CustomerController.getCustomer);
router.put("/:id", CustomerController.updateCustomer);
router.delete("/:id", CustomerController.deleteCustomer);

export default router;
