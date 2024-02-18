import { NextFunction, Request, Response } from 'express';
import { AppError } from '../error/AppError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let message = `Something broke!`;
    let statusCode = 500;
    let additionalPayload = {};

    if (err instanceof AppError) {
        message = err.message;
        statusCode = err.statusCode;

        if (err.payload) {
            additionalPayload = err.payload;
        }
    }

    res.status(statusCode).send({ message, ...additionalPayload });
};
