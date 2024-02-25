import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

export interface Request<Param = object, Body = object, Query = object>
    extends ExpressRequest<Param, object, Body, Query> {}

export interface Response<Res = object, Locals extends Record<string, unknown> = Record<string, unknown>>
    extends ExpressResponse<Res, Locals> {}

export interface CatDBItem {
    id: number;
    name: string;
    date_of_birth: string;
    color: string;
    created_at: string;
    updated_at: string;
}
