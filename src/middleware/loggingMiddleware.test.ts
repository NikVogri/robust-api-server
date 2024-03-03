import { afterAll, describe, expect, it, vi } from 'vitest';
import { loggingMiddleware } from './loggingMiddleware';
import { container } from 'tsyringe';

import { getRequest, getResponse } from '../../vitest.mock';
import { Logger } from '../services/logging/logger';
import { startApiServer } from '../server';
import supertest from 'supertest';

vi.mock('../services/logging/logger', () => {
    const Logger = vi.fn(() => ({
        http: vi.fn(),
        info: vi.fn(),
    }));

    return { Logger };
});

describe('Test loggingMiddleware', () => {
    container.registerInstance(Logger, new Logger());
    const logger = container.resolve(Logger);

    afterAll(() => {
        container.reset();
    });

    it('should call the next function', async () => {
        expect.assertions(1);

        const request = getRequest();
        const response = getResponse();
        const nextFn = vi.fn();

        loggingMiddleware(request, response, nextFn);
        expect(nextFn).toHaveBeenCalled();
    });

    it('should log the request before sending a response', async () => {
        expect.assertions(2);

        vi.spyOn(logger, 'http').mockImplementationOnce((...args) => {
            expect(args[0].path).toMatchSnapshot();
            expect(args[1].statusCode).toMatchSnapshot();

            return undefined;
        });

        const app = startApiServer();
        await supertest(app).get(`/status`);
        app.close();
    });
});
