import { z } from 'zod';

export const finalizeSetupSchema = z.object({
    body: z.object({
        newEmail: z.string().email("Invalid email format"),
        newPassword: z.string().min(8, "Password must be at least 8 characters")
    })
});
