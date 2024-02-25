import { NextFunction } from 'express';
import { Request, Response } from '../models';

export const withErrorHandling =
    <Req extends Request, Res extends Response>(handler: (req: Req, res: Res, next: NextFunction) => Promise<void>) =>
    async (req: Req, res: Res, next: NextFunction) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            req.thrownError = error as Error;
            next(error);
        }
    };
