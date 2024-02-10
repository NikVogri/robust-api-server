import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';
import { Logger } from '../clients/logger';

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get(Logger);
    const end = res.end;

    // @ts-expect-error - overriding the res.end function which gets called last
    res.end = (chunk, encoding: BufferEncoding) => {
        res.end = end;
        res.end(chunk, encoding);

        // @ts-expect-error - TODO: fix Request type to include optional thrownError
        // In case request has an additional 'thrownError' property, include it in the log.
        logger.http(req, res, req.thrownError);
    };

    next();
};
