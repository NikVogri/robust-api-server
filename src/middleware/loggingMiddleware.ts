import { NextFunction, Request, Response } from 'express';
import { Logger } from '../clients/logger';
import { container } from 'tsyringe';

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const logger = container.resolve(Logger);
    const end = res.end;

    // @ts-expect-error - overriding the res.end function which gets called last
    res.end = (chunk, encoding: BufferEncoding) => {
        res.end = end;
        res.end(chunk, encoding);

        logger.http(req, res, req.thrownError);
    };

    next();
};
