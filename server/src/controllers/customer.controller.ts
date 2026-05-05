import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";
import prisma from "../config/prisma.js";

export const getAllCustomers = catchAsync(async (req: any, res: any) => {
  const { search, status, sortBy = "newest", page = 1, limit = 50 } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  const where: any = {};
  if (status && status !== "ALL") where.status = status;
  if (search) {
    where.email = { contains: search, mode: "insensitive" };
  }

  let orderBy: any = { createdAt: "desc" };
  if (sortBy === "oldest") orderBy = { createdAt: "asc" };
  if (sortBy === "email") orderBy = { email: "asc" };
  if (sortBy === "email_desc") orderBy = { email: "desc" };

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      include: {
        services: {
          select: {
            id: true,
            xuiId: true,
            xuiEmail: true,
            inboundId: true,
            status: true,
          },
        },
        _count: {
          select: { payments: true },
        },
      },
      orderBy,
      skip,
      take: parseInt(limit as string),
    }),
    prisma.customer.count({ where }),
  ]);

  // compute total paid for each customer
  const enrichedCustomers = await Promise.all(
    customers.map(async (c) => {
      const totalPaid = await prisma.payment.aggregate({
        where: { customerId: c.id, status: "PAID" },
        _sum: { amountPaid: true },
      });

      return {
        ...c,
        totalPayments: c._count.payments,
        totalPaid: totalPaid._sum.amountPaid || 0,
        linkedServices: c.services,
      };
    })
  );

  return res.json({
    success: true,
    obj: enrichedCustomers,
    pagination: {
      total,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(total / parseInt(limit as string)),
    },
  });
});

export const getCustomer = catchAsync(async (req: any, res: any) => {
  const customer = await prisma.customer.findUnique({
    where: { id: req.params.id },
    include: {
      services: true,
      payments: {
        include: { preset: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!customer) {
    throw new AppError("Customer not found", 404);
  }

  return res.json({ success: true, obj: customer });
});

export const updateCustomer = catchAsync(async (req: any, res: any) => {
  const { email, notes, status } = req.body;
  const updateData: any = {};

  if (email !== undefined) updateData.email = email;
  if (notes !== undefined) updateData.notes = notes;
  if (status !== undefined) updateData.status = status;

  try {
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: updateData,
    });
    return res.json({ success: true, msg: "Customer updated", obj: customer });
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new AppError("A customer with this email already exists", 400);
    }
    throw error;
  }
});

export const deleteCustomer = catchAsync(async (req: any, res: any) => {
  const customer = await prisma.customer.findUnique({
    where: { id: req.params.id },
    include: { services: { where: { status: "ACTIVE" } } },
  });

  if (!customer) {
    throw new AppError("Customer not found", 404);
  }

  if (customer.services.length > 0) {
    throw new AppError(
      "Cannot delete a customer with active linked services. Unlink all services first.",
      400
    );
  }

  // delete payments first, then customer
  await prisma.payment.deleteMany({ where: { customerId: customer.id } });
  await prisma.customer.delete({ where: { id: customer.id } });

  return res.json({ success: true, msg: "Customer deleted" });
});
