import { Request } from 'express';

export interface RequestWithBody<T> extends Request {
    body: T;
}

export interface CatDBItem {
    id: number;
    name: string;
    date_of_birth: string;
    color: string;
    created_at: string;
    updated_at: string;
}
