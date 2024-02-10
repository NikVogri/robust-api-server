import { NextFunction, Request, Response } from 'express';

export const withErrorHandling =
    (handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            // @ts-expect-error TODO: sort this to be a valid type
            req.thrownError = error;

            next(error);
        }
    };
