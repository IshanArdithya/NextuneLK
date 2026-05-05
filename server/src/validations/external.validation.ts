import { z } from 'zod';

export const getClientUsageSchema = z.object({
    params: z.object({
        email: z.string().min(1, "Identifier is required")
    })
});
