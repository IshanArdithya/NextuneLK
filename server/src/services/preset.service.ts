import prisma from "../config/prisma.js";

export const PresetService = {
  getPresets: async () => {
    return prisma.preset.findMany({
      where: { isActive: true },
      orderBy: { amount: "asc" },
    });
  },

  getAllPresets: async () => {
    return prisma.preset.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  createPreset: async (data: { name: string; quotaGB: number; days: number; amount: number; currency?: string }) => {
    return prisma.preset.create({
      data: {
        name: data.name,
        quotaGB: data.quotaGB,
        days: data.days,
        amount: data.amount,
        currency: data.currency || "LKR",
      },
    });
  },

  updatePreset: async (id: string, data: any) => {
    return prisma.preset.update({
      where: { id },
      data,
    });
  },

  deletePreset: async (id: string) => {
    return prisma.preset.delete({ where: { id } });
  },
};
