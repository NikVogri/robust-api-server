import { describe, expect, test, vi } from 'vitest';
import { Logger } from './logger';
import winston from 'winston';
import { AppError } from '../../error/AppError';
import { getRequest, getResponse } from '../../../vitest.mock';

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

        const request = getRequest();
        request.originalUrl = '/some/path/:id/items';
        request.url = '/some/path/:id/items';
        request.path = '/some/path/:id/items';
        request.method = 'GET';
        request.hostname = 'hostname';
        request.httpVersion = 'HTTP/1.1';
        request.headers = { ['user-agent']: 'test' };
        request.query = { page: '1', perPage: '10' };
        request.params = { id: '12345' };
        request.body = { session: '987654321' };

        const response = getResponse();
        response.statusCode = 400;

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
