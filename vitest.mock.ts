import { Request, Response } from 'express';
import { vi } from 'vitest';

export const getRequest = () => {
    return {} as unknown as Request;
};

export const getResponse = () => {
    return {
        status: vi.fn(() => getResponse()),
        send: vi.fn(() => getResponse()),
    } as unknown as Response;
};
