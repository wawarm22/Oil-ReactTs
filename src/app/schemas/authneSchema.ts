import { z } from "zod";

export const authSchema = z.object({
    email: z.string(),
    role: z.string(),
    token: z.string(),
    expiresIn: z.string().datetime(),
});
