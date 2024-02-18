import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { AppError } from '../error/AppError';

interface RequestSchema {
    body?: ZodSchema;
    params?: ZodSchema;
    query?: ZodSchema;
}

interface ParseErrors {
    schema: keyof RequestSchema;
    error: ZodError;
}

export const withValidate = (schema: RequestSchema) => async (req: Request, _: Response, next: NextFunction) => {
    const parseErrors: ParseErrors[] = [];

    if (schema.params) {
        const parsed = schema.params.safeParse(req.params);
        if (!parsed.success) parseErrors.push({ schema: 'params', error: parsed.error });
    }

    if (schema.query) {
        const parsed = schema.query.safeParse(req.query);
        if (!parsed.success) parseErrors.push({ schema: 'query', error: parsed.error });
    }

    if (schema.body) {
        const parsed = schema.body.safeParse(req.body);
        if (!parsed.success) parseErrors.push({ schema: 'body', error: parsed.error });
    }

    if (parseErrors.length > 0) {
        next(
            new AppError({
                message: 'Invalid payload',
                statusCode: 400,
                payload: {
                    errors: parseErrors.reduce((curr, acc) => {
                        return {
                            ...curr,
                            [acc.schema]: acc.error.issues,
                        };
                    }, {}),
                },
            }),
        );
    } else {
        next();
    }
};
