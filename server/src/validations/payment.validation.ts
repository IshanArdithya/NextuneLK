import { z } from 'zod';

export const createPaymentSchema = z.object({
    body: z.object({
        customerEmail: z.string().email("Invalid email format").optional().or(z.literal("")),
        inboundId: z.number().min(1, "Inbound ID is required"),
        amountPaid: z.number().min(0).optional(),
        status: z.enum(["PAID", "UNPAID"]).optional(),
    })
});

export const updatePaymentSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Payment ID is required")
    }),
    body: z.object({
        amountPaid: z.number().min(0).optional(),
        status: z.enum(["PAID", "UNPAID"]).optional(),
        notes: z.string().nullable().optional(),
        paymentDate: z.string().datetime().nullable().optional()
    })
});
