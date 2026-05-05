import prisma from "../config/prisma.js";

export const PaymentService = {
  createPayment: async (data: any) => {
    return prisma.payment.create({ data });
  },

  getAllPayments: async (filters: { status?: string; email?: string }, skip: number, take: number) => {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.email) where.customerEmail = { contains: filters.email, mode: "insensitive" };

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: { preset: true },
        orderBy: { createdAt: "desc" },
        skip,
        take,
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

  updatePayment: async (id: string, data: any) => {
    return prisma.payment.update({
      where: { id },
      data,
    });
  },

  deletePayment: async (id: string) => {
    return prisma.payment.delete({ where: { id } });
  },
};
