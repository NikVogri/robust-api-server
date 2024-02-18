import { z } from 'zod';

export type CreateCatDto = z.infer<typeof createCatSchema>;
export const createCatSchema = z.object({
    name: z.string(),
    dateOfBirth: z.string().regex(/[0-9]{4}-[0-9]{2}-[0-9]{2}/),
    color: z.string(),
});
