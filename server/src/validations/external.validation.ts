import { z } from 'zod';

export const getClientUsageSchema = z.object({
    params: z.object({
        email: z.string().email("Invalid email format")
    })
});
