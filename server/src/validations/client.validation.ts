import { z } from 'zod';

export const addClientSchema = z.object({
    body: z.object({
        inboundId: z.string().min(1, "Inbound ID is required"),
        email: z.string().email("Invalid email format"),
        totalGB: z.number().min(0).optional(),
        limitIp: z.number().min(0).optional(),
        expiryTime: z.string().nullable().optional(),
        enable: z.boolean().optional(),
        flow: z.string().optional(),
        amountPaid: z.number().min(0).optional(),
        paymentStatus: z.enum(["PAID", "UNPAID", "Paid", "Unpaid"]).optional()
    })
});

export const updateClientSchema = z.object({
    body: z.object({
        inboundId: z.string().min(1, "Inbound ID is required"),
        clientId: z.string().min(1, "Client ID is required"),
        email: z.string().email("Invalid email format"),
    })
});

export const deleteClientSchema = z.object({
    body: z.object({
        inboundId: z.string().min(1, "Inbound ID is required"),
        clientId: z.string().min(1, "Client ID is required"),
    })
});
