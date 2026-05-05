import { ClientService } from "../services/client.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const addClient = catchAsync(async (req: any, res: any) => {
  const result = await ClientService.addClientWithPayment(req.body);
  
  return res.json({
    success: true,
    msg: "Client added successfully",
    ...result,
  });
});

export const updateClient = catchAsync(async (req: any, res: any) => {
  const { inboundId, clientId, xuiEmail } = req.body;
  if (!inboundId || !clientId || !xuiEmail) {
    throw new AppError("inboundId, clientId, and xuiEmail are required", 400);
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

export const syncClients = catchAsync(async (req: any, res: any) => {
  await ClientService.syncPanelToDb();
  return res.json({ 
    success: true, 
    msg: "Database synchronized with XUI panel successfully" 
  });
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

// customer linking

export const checkCustomerEmail = catchAsync(async (req: any, res: any) => {
  const { email } = req.query;
  if (!email) {
    throw new AppError("email query parameter is required", 400);
  }

  const result = await ClientService.checkCustomerEmail(email as string);
  return res.json({ success: true, obj: result });
});

export const linkCustomer = catchAsync(async (req: any, res: any) => {
  const { xuiId, email } = req.body;
  if (!xuiId || !email) {
    throw new AppError("xuiId and email are required", 400);
  }

  const result = await ClientService.linkCustomer(xuiId, email);
  return res.json({ success: true, msg: "Customer linked successfully", obj: result });
});

export const unlinkCustomer = catchAsync(async (req: any, res: any) => {
  const { xuiId } = req.body;
  if (!xuiId) {
    throw new AppError("xuiId is required", 400);
  }

  const result = await ClientService.unlinkCustomer(xuiId);
  return res.json({ success: true, msg: "Customer unlinked successfully", obj: result });
});
