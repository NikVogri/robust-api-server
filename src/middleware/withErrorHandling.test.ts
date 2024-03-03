import { describe, expect, it, vi } from 'vitest';
import { withErrorHandling } from './withErrorHandling';
import { Request, Response } from '../types';
import { NextFunction } from 'express';
import { getRequest, getResponse } from '../../vitest.mock';
import { AppError } from '../error/AppError';

describe('Test withErrorHandling', () => {
    it('should handle case when handler throws no errors', async () => {
        const request = getRequest();
        const response = getResponse();
        const nextFn = vi.fn();

        const handler = (req: Request, res: Response, next: NextFunction) => {
            next();
        };

        const wrappedHandler = withErrorHandling(async (req, res, next) => handler(req, res, next));
        await wrappedHandler(request, response, nextFn);

        expect(nextFn).toBeCalled();
    });

    it('should should handle case when handler throws an error', async () => {
        const request = getRequest();
        const response = getResponse();
        const nextFn = vi.fn();

        const error = new AppError({ message: 'some error occured', statusCode: 400 });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const handler = (req: Request, res: Response, next: NextFunction) => {
            throw error;
        };

        const wrappedHandler = withErrorHandling(async (req, res, next) => handler(req, res, next));
        await wrappedHandler(request, response, nextFn);

        expect(request).toHaveProperty('thrownError');
        expect(request.thrownError).toBe(error);
        expect(nextFn).toHaveBeenCalled();
    });
});
