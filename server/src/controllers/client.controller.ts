// @ts-nocheck
import { ClientService } from "../services/client.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const addClient = catchAsync(async (req: any, res: any) => {
  if (!req.body.inboundId || !req.body.email) {
    throw new AppError("inboundId and email are required", 400);
  }

  const result = await ClientService.addClientWithPayment(req.body);
  
  return res.json({
    success: true,
    msg: "Client added successfully",
    ...result,
  });
});

export const updateClient = catchAsync(async (req: any, res: any) => {
  const { inboundId, clientId, email } = req.body;
  if (!inboundId || !clientId || !email) {
    throw new AppError("inboundId, clientId, and email are required", 400);
  }

  await ClientService.updateClientConfig(req.body);

  return res.json({ success: true, msg: "Client updated successfully" });
});

export const deleteClient = catchAsync(async (req: any, res: any) => {
  const { inboundId, clientId } = req.body;
  if (!inboundId || !clientId) {
    throw new AppError("inboundId and clientId are required", 400);
  }

  await ClientService.deleteClientConfig(inboundId, clientId);

  return res.json({ success: true, msg: "Client deleted successfully" });
});

export const resetClientCycle = catchAsync(async (req: any, res: any) => {
  const { inboundId, clientId, email } = req.body;
  if (!inboundId || !email || !clientId) {
    throw new AppError("inboundId, clientId, and email are required", 400);
  }

  const { payment, isPaid } = await ClientService.resetClientCycleWithPayment(req.body);

  return res.json({
    success: true,
    msg: isPaid ? "Client cycle reset. Paid invoice created." : "Client cycle reset. New unpaid invoice created.",
    paymentId: payment.id,
  });
});
