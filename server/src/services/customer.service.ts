import prisma from "../config/prisma.js";

export const CustomerService = {
  getAllCustomers: async (filter: any, skip: number, limit: number) => {
    const where: any = {};
    if (filter.status && filter.status !== "ALL") {
      where.status = filter.status;
    }
    if (filter.search) {
      where.OR = [
        { email: { contains: filter.search, mode: "insensitive" } },
        { name: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    const orderBy: any = {};
    if (filter.sortBy === "name") orderBy.name = "asc";
    else if (filter.sortBy === "email") orderBy.email = "asc";
    else if (filter.sortBy === "oldest") orderBy.createdAt = "asc";
    else orderBy.createdAt = "desc";

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          services: {
            select: {
              id: true,
              xuiEmail: true,
              inboundId: true,
              status: true,
            },
          },
          payments: {
            select: {
              status: true,
              amountPaid: true,
            },
          },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    // map to include totalPaid and unpaidCount
    const mappedCustomers = customers.map((c: any) => {
      const totalPaid = c.payments
        .filter((p: any) => p.status === "PAID")
        .reduce((sum: number, p: any) => sum + p.amountPaid, 0);
      
      const unpaidCount = c.payments.filter((p: any) => p.status === "UNPAID").length;

      return {
        ...c,
        totalPaid,
        unpaidCount,
        totalPayments: c.payments.length,
        linkedServices: c.services,
      };
    });

    return { customers: mappedCustomers, total };
  },

  getCustomerById: async (id: string) => {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        services: true,
        payments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },

  createCustomer: async (data: any) => {
    return prisma.customer.create({
      data: data as any,
    });
  },

  updateCustomer: async (id: string, data: any) => {
    return prisma.customer.update({
      where: { id },
      data: data as any,
    });
  },

  deleteCustomer: async (id: string) => {
    // unbind all services (null in customerId field)
    await prisma.service.updateMany({
      where: { customerId: id },
      data: { customerId: null },
    });

    // check for payment history
    const paymentCount = await prisma.payment.count({
      where: { customerId: id },
    });

    if (paymentCount > 0) {
      // archive if history exists
      return prisma.customer.update({
        where: { id },
        data: { status: "ARCHIVED" },
      });
    }

    // perm delete if no payment history
    return prisma.customer.delete({
      where: { id },
    });
  },
};
