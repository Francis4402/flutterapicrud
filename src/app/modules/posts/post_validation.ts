import { z } from "zod";

export const postValidationShcema = z.object({
    body: z.object({
        title: z.string().min(1).max(100),
        description: z.string().min(1).max(100),
    })
});
