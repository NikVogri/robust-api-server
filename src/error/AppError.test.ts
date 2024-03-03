import { describe, expect, it } from 'vitest';
import { AppError } from './AppError';

describe('Test AppError', () => {
    it('should should initialize payload as expected', async () => {
        const error = new AppError({
            message: 'error message',
            statusCode: 400,
            payload: {
                some: 'property',
            },
            thrownError: new Error('Some thrown error'),
        });

        expect(JSON.stringify(error)).toMatchSnapshot();
    });

    it('should create a stringifiable error object', async () => {
        const error = new Error('Some error');
        error.stack = 'some-stack';

        expect(AppError.toStringifiableObject(error)).toMatchSnapshot();
    });
});
