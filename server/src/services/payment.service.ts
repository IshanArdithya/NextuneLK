// @ts-nocheck
import prisma from "../config/prisma.js";

export const PaymentService = {
  getAllPayments: async (filter: any, skip: number, limit: number) => {
    const where: any = {};
    if (filter.status && filter.status !== "ALL") where.status = filter.status;
    if (filter.startDate || filter.endDate) {
      where.createdAt = {};
      if (filter.startDate) where.createdAt.gte = new Date(filter.startDate);
      if (filter.endDate) where.createdAt.lte = new Date(filter.endDate);
    }
    if (filter.email) {
      where.OR = [
        { customerEmail: { contains: filter.email } },
        { customerName: { contains: filter.email } },
      ];
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: (() => {
          if (filter.sortBy === "oldest") return { createdAt: "asc" };
          if (filter.sortBy === "amount_desc") return { amountPaid: "desc" };
          if (filter.sortBy === "amount_asc") return { amountPaid: "asc" };
          return { createdAt: "desc" };
        })(),
        include: { preset: true },
      }),
      prisma.payment.count({ where }),
    ]);

    return { payments, total };
  },

  getPaymentsByEmail: async (email: string) => {
    return prisma.payment.findMany({
      where: { customerEmail: email },
      include: { preset: true },
      orderBy: { createdAt: "desc" },
    });
  },

  getPaymentsByCustomerId: async (customerId: string) => {
    return prisma.payment.findMany({
      where: { customerId },
      include: { preset: true },
      orderBy: { createdAt: "desc" },
    });
  },

  updatePayment: async (id: string, data: any) => {
    return prisma.payment.update({
      where: { id },
      data,
    });
  },

  createPayment: async (data: any) => {
    // snapshot customer name for history
    if (data.customerId && !data.customerName) {
      const customer = await prisma.customer.findUnique({
        where: { id: data.customerId },
        select: { name: true, email: true }
      });
      if (customer) {
        data.customerName = customer.name || customer.email;
      }
    }

    return prisma.payment.create({
      data: data as any,
    });
  },

  deletePayment: async (id: string) => {
    return prisma.payment.delete({
      where: { id },
    });
  },
};
