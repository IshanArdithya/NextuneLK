import express from "express";
import * as PaymentController from "../../controllers/payment.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createPaymentSchema, updatePaymentSchema } from "../../validations/payment.validation.js";

const router = express.Router();

router.get("/all", PaymentController.getAllPayments);
router.get("/:identifier", PaymentController.getPayments);
router.post("/", validate(createPaymentSchema), PaymentController.createPayment);
router.put("/:id", validate(updatePaymentSchema), PaymentController.updatePayment);
router.delete("/:id", PaymentController.deletePayment);

export default router;
