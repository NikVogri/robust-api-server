import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export const validateInput = (schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (parsed.success) {
        return next();
    } else {
        return next(parsed.error);
    }
};
