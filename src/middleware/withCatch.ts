import { NextFunction, Request, Response } from 'express';

export const withErrorHandling =
    (handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            // @ts-expect-error - append error to request object to be used further down the pipeline
            req.thrownError = error;

            next(error);
        }
    };
