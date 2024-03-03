import { describe, expect, it, vi } from 'vitest';
import { Postgres } from '../services/database/postgres';
import { Logger } from '../services/logging/logger';
import { CatsRepository } from './cats';
import { AppError } from '../error/AppError';

vi.mock('../services/logging/logger');
vi.mock('../services/database/postgres', () => {
    return {
        Postgres: vi.fn(() => ({
            pool: {
                query: vi.fn(),
            },
        })),
    };
});

describe('Test CatsRepository', () => {
    const logger = new Logger();
    const pg = new Postgres(logger);

    const catsRepo = new CatsRepository(pg);

    it('should create a new cat record', async () => {
        expect.assertions(2);

        vi.spyOn(pg.pool, 'query').mockImplementationOnce(async (...args) => {
            expect(args).toMatchSnapshot();
            return Promise.resolve({
                rows: [{ id: 1 }],
            });
        });

        const res = await catsRepo.create({ name: 'Kiki', dateOfBirth: '2010-09-05', color: 'gray' });
        expect(res).toMatchSnapshot();
    });

    it('should throw an app error when unable to create a cat', async () => {
        expect.assertions(2);

        vi.spyOn(pg.pool, 'query').mockImplementationOnce(async (...args) => {
            expect(args).toMatchSnapshot();
            throw new Error('something went wrong');
        });

        try {
            await catsRepo.create({ name: 'Kiki', dateOfBirth: '2010-09-05', color: 'gray' });
        } catch (err) {
            expect(err).toBeInstanceOf(AppError);
        }
    });
});
