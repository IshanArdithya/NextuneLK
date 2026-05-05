import { z } from 'zod';

export const addClientSchema = z.object({
    body: z.object({
        inboundId: z.string().min(1, "Inbound ID is required"),
        xuiEmail: z.string().min(1, "Client name is required"),
        email: z.string().email("Invalid email format").optional().or(z.literal("")),
        linkAction: z.enum(["create", "link", "skip"]).optional(),
        totalGB: z.number().min(0).optional(),
        limitIp: z.number().min(0).optional(),
        expiryTime: z.string().nullable().optional(),
        startAfterFirstUse: z.boolean().optional(),
        startAfterFirstUseDays: z.number().min(0).optional(),
        enable: z.boolean().optional(),
        flow: z.string().optional(),
        comment: z.string().optional(),
        amountPaid: z.number().min(0).optional(),
        paymentStatus: z.enum(["PAID", "UNPAID", "Paid", "Unpaid"]).optional()
    })
});

export const updateClientSchema = z.object({
    body: z.object({
        inboundId: z.string().min(1, "Inbound ID is required"),
        clientId: z.string().min(1, "Client ID is required"),
        xuiEmail: z.string().min(1, "Client name is required"),
        totalGB: z.number().min(0).optional(),
        limitIp: z.number().min(0).optional(),
        expiryTime: z.number().min(0).optional(),
        startAfterFirstUse: z.boolean().optional(),
        startAfterFirstUseDays: z.number().min(0).optional(),
        enable: z.boolean().optional(),
        flow: z.string().optional(),
        comment: z.string().optional(),
        subId: z.string().optional(),
        tgId: z.number().optional(),
        reset: z.number().optional(),
    })
});

export const deleteClientSchema = z.object({
    body: z.object({
        inboundId: z.string().min(1, "Inbound ID is required"),
        clientId: z.string().min(1, "Client ID is required"),
    })
});

export const linkCustomerSchema = z.object({
    body: z.object({
        xuiId: z.string().min(1, "XUI ID is required"),
        email: z.string().email("Invalid email format"),
    })
});

export const unlinkCustomerSchema = z.object({
    body: z.object({
        xuiId: z.string().min(1, "XUI ID is required"),
    })
});
