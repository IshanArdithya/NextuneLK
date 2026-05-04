import { z } from 'zod';

export const createPresetSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        quotaGB: z.number().min(0, "Quota GB cannot be negative"),
        days: z.number().min(1, "Days must be at least 1"),
        amount: z.number().min(0, "Amount cannot be negative"),
        currency: z.string().optional(),
    })
});

export const updatePresetSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Preset ID is required")
    }),
    body: z.object({
        name: z.string().min(2).optional(),
        quotaGB: z.number().min(0).optional(),
        days: z.number().min(1).optional(),
        amount: z.number().min(0).optional(),
        currency: z.string().optional(),
        isActive: z.boolean().optional()
    })
});
