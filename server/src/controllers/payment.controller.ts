// @ts-nocheck
import { PaymentService } from "../services/payment.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const getAllPayments = catchAsync(async (req: any, res: any) => {
  const { status, email, sortBy = "newest", page = 1, limit = 50 } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  const { payments, total } = await PaymentService.getAllPayments({ status, email, sortBy }, skip, parseInt(limit as string));

  return res.json({
    success: true,
    obj: payments,
    pagination: {
      total,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(total / parseInt(limit as string)),
    },
  });
});

export const getPayments = catchAsync(async (req: any, res: any) => {
  const payments = await PaymentService.getPaymentsByEmail(req.params.email);
  return res.json({ success: true, obj: payments });
});

export const updatePayment = catchAsync(async (req: any, res: any) => {
  const { amountPaid, status, notes, paymentDate } = req.body;
  const updateData: any = {};
  
  if (amountPaid !== undefined) updateData.amountPaid = amountPaid;
  if (status !== undefined) updateData.status = status;
  if (notes !== undefined) updateData.notes = notes;
  if (paymentDate !== undefined) updateData.paymentDate = new Date(paymentDate);

  if (status === "PAID" && !paymentDate) {
    updateData.paymentDate = new Date();
  }

  const payment = await PaymentService.updatePayment(req.params.id, updateData);

  return res.json({ success: true, msg: "Payment updated successfully", obj: payment });
});

export const createPayment = catchAsync(async (req: any, res: any) => {
  const { customerEmail, inboundId } = req.body;
  if (!customerEmail || !inboundId) {
    throw new AppError("customerEmail and inboundId are required", 400);
  }

  const payload = { ...req.body };
  if (payload.paymentDate) payload.paymentDate = new Date(payload.paymentDate);
  if (payload.cycleStart) payload.cycleStart = new Date(payload.cycleStart);
  else payload.cycleStart = new Date();
  if (payload.cycleEnd) payload.cycleEnd = new Date(payload.cycleEnd);
  if (!payload.status) payload.status = "UNPAID";
  payload.inboundId = parseInt(inboundId);

  const payment = await PaymentService.createPayment(payload);

  return res.json({ success: true, msg: "Payment record created", obj: payment });
});

export const deletePayment = catchAsync(async (req: any, res: any) => {
  await PaymentService.deletePayment(req.params.id);
  return res.json({ success: true, msg: "Payment record deleted" });
});
