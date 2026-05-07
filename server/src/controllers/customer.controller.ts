// @ts-nocheck
import { CustomerService } from "../services/customer.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";
import prisma from "../config/prisma.js";

export const getAllCustomers = catchAsync(async (req: any, res: any) => {
  const { search, status, sortBy = "newest", page = 1, limit = 50 } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  const { customers, total } = await CustomerService.getAllCustomers(
    { search, status, sortBy },
    skip,
    parseInt(limit as string)
  );

  return res.json({
    success: true,
    obj: customers,
    pagination: {
      total,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(total / parseInt(limit as string)),
    },
  });
});

export const getCustomerById = catchAsync(async (req: any, res: any) => {
  const customer = await CustomerService.getCustomerById(req.params.id);
  if (!customer) throw new AppError("Customer not found", 404);
  return res.json({ success: true, obj: customer });
});

export const getDeletionStats = catchAsync(async (req: any, res: any) => {
  const { id } = req.params;
  
  // count active services
  const activeServicesCount = await prisma.service.count({
    where: { customerId: id, status: "ACTIVE" }
  });

  // count unpaid payments and total owed
  const unpaidPayments = await prisma.payment.findMany({
    where: { customerId: id, status: "UNPAID" },
    select: { amountPaid: true }
  });

  const totalOwed = unpaidPayments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);

  return res.json({
    success: true,
    obj: {
      activeServices: activeServicesCount,
      unpaidPayments: unpaidPayments.length,
      totalOwed
    }
  });
});

export const createCustomer = catchAsync(async (req: any, res: any) => {
  const customer = await CustomerService.createCustomer(req.body);
  return res.json({ success: true, msg: "Customer created successfully", obj: customer });
});

export const updateCustomer = catchAsync(async (req: any, res: any) => {
  const customer = await CustomerService.updateCustomer(req.params.id, req.body);
  return res.json({ success: true, msg: "Customer updated successfully", obj: customer });
});

export const deleteCustomer = catchAsync(async (req: any, res: any) => {
  await CustomerService.deleteCustomer(req.params.id);
  return res.json({ success: true, msg: "Customer deleted successfully" });
});
