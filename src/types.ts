import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT?: string;
            PG_DB_CONNECTION_STR?: string;
            REDIS_DB_CONNECTION_STR?: string;
        }
    }
    namespace Express {
        export interface Request {
            thrownError?: Error;
            // Extend global request type with properties
            // e.g. user?: {id: string;}
        }
    }
}

export interface Request<Param = object, Body = object, Query = object>
    extends ExpressRequest<Param, object, Body, Query> {}

export interface Response<Res = object, Locals extends Record<string, unknown> = Record<string, unknown>>
    extends ExpressResponse<Res, Locals> {}
