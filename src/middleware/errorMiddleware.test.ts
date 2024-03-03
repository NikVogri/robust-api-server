import { describe, expect, it, vi } from 'vitest';
import { errorMiddleware } from './errorMiddleware';
import { AppError } from '../error/AppError';

import { getRequest, getResponse } from '../../vitest.mock';

describe('Test errorMiddleware', () => {
    it('should send formatted response for unexpected error', async () => {
        const request = getRequest();
        const response = getResponse();
        const nextFn = vi.fn();

        const error = new Error('Some unknown error occured');

        vi.spyOn(response, 'status').mockImplementationOnce((...args) => {
            expect(args).toMatchSnapshot();
            return response;
        });

        vi.spyOn(response, 'send').mockImplementationOnce((...args) => {
            expect(args).toMatchSnapshot();
            return response;
        });

        errorMiddleware(error, request, response, nextFn);
    });

    it('should send formatted response for AppError error', async () => {
        const request = getRequest();
        const response = getResponse();
        const nextFn = vi.fn();

        const error = new AppError({
            message: 'Some message',
            statusCode: 400,
            errorCode: 'error-code',
            payload: {
                additional: 'payload',
            },
        });

        vi.spyOn(response, 'status').mockImplementationOnce((...args) => {
            expect(args).toMatchSnapshot();
            return response;
        });

        vi.spyOn(response, 'send').mockImplementationOnce((...args) => {
            expect(args).toMatchSnapshot();
            return response;
        });

        errorMiddleware(error, request, response, nextFn);
    });
});
