import { describe, expect, test, vi } from 'vitest';
import { Logger } from './logger';
import winston from 'winston';
import { Request, Response } from '../../models';
import { AppError } from '../../error/AppError';

describe('Test Logger client', () => {
    const logger = new Logger();

    test('error logging', async () => {
        vi.spyOn(logger.winston, 'error').mockImplementationOnce((...args) => {
            expect(args).toMatchSnapshot();
            return {} as winston.Logger;
        });

        const error = new Error('Something went wrong');
        error.stack = 'error-stack';

        const logMessage = 'Oh, uh!';

        logger.error(logMessage, error);
    });

    test('info logging', async () => {
        vi.spyOn(logger.winston, 'info').mockImplementationOnce((...args) => {
            expect(args).toMatchSnapshot();
            return {} as winston.Logger;
        });

        logger.info('This is some info');
    });

    test('http logging', async () => {
        vi.spyOn(logger.winston, 'http').mockImplementationOnce((...args) => {
            expect(args).toMatchSnapshot();
            return {} as winston.Logger;
        });

        const request = {
            originalUrl: '/some/path/:id/items',
            url: '/some/path/:id/items',
            path: '/some/path/:id/items',
            method: 'GET',
            hostname: 'hostname',
            version: 'HTTP/1.1',
            headers: {
                ['user-agent']: 'test',
            },
            query: {
                page: '1',
                perPage: '10',
            },
            params: {
                id: '12345',
            },
            body: {
                session: '987654321',
            },
        } as unknown as Request;

        const response = {
            statusCode: 400,
        } as Response;

        const thrownError = new Error('Something went wrong');
        thrownError.stack = 'thrown-error-stack';

        const appError = new AppError({
            message: 'this is a message',
            statusCode: 400,
            thrownError: thrownError,
        });

        logger.http(request, response, appError);
    });
});
