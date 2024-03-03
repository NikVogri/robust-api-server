import { describe, expect, it, vi } from 'vitest';
import { withValidate } from './withValidate';
import z from 'zod';
import { getRequest, getResponse } from '../../vitest.mock';
import { AppError } from '../error/AppError';

describe('Test withValidate', () => {
    it('should should go to the next middleware without forwarding an error when all validation', async () => {
        expect.assertions(1);

        const request = getRequest();
        const response = getResponse();
        const nextFn = vi.fn();

        nextFn.mockImplementationOnce((...args) => {
            expect(args[0]).toBeUndefined();
            return undefined;
        });

        const schemaValidator = withValidate({
            params: z.object({ id: z.string() }),
            body: z.object({ username: z.string() }),
            query: z.object({ page: z.string() }),
        });

        request.query = { page: '1' };
        request.body = { username: 'username' };
        request.params = { id: 'identifier' };

        await schemaValidator(request, response, nextFn);
    });

    it('should forward error when parameter validation fails', async () => {
        expect.assertions(2);

        const request = getRequest();
        const response = getResponse();
        const nextFn = vi.fn();

        nextFn.mockImplementationOnce((...args) => {
            expect(args[0]).toBeInstanceOf(AppError);
            expect(JSON.stringify(args[0])).toMatchSnapshot();
            return undefined;
        });

        const schemaValidator = withValidate({
            params: z.object({
                id: z.string(),
            }),
        });

        await schemaValidator(request, response, nextFn);
    });

    it('should forward error when query validation fails', async () => {
        expect.assertions(2);

        const request = getRequest();
        const response = getResponse();
        const nextFn = vi.fn();

        nextFn.mockImplementationOnce((...args) => {
            expect(args[0]).toBeInstanceOf(AppError);
            expect(JSON.stringify(args[0])).toMatchSnapshot();
            return undefined;
        });

        const schemaValidator = withValidate({
            query: z.object({
                page: z.number(),
            }),
        });

        await schemaValidator(request, response, nextFn);
    });

    it('should forward error when body validation fails', async () => {
        expect.assertions(2);

        const request = getRequest();
        const response = getResponse();
        const nextFn = vi.fn();

        nextFn.mockImplementationOnce((...args) => {
            expect(args[0]).toBeInstanceOf(AppError);
            expect(JSON.stringify(args[0])).toMatchSnapshot();
            return undefined;
        });

        const schemaValidator = withValidate({
            body: z.object({
                username: z.string(),
            }),
        });

        await schemaValidator(request, response, nextFn);
    });
});
