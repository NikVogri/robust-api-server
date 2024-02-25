import { describe, expect, it, vi } from 'vitest';
import { CatsService } from './cats';
import { CatsRepository } from '../repositories/cats';
import { Bull } from './async/bull';
import { Postgres } from './database/postgres';
import { Logger } from './logging/logger';
import { Redis } from './database/redis';
import { CatDBItem } from '../models';
import { Job } from 'bullmq';
import { AppError } from '../error/AppError';

vi.mock('../clients/logger');
vi.mock('../clients/postgres');
vi.mock('../clients/redis');
vi.mock('../clients/bull', () => {
    return {
        Bull: vi.fn(() => ({
            queues: {
                catPetterQueue: {
                    add: vi.fn(),
                },
            },
        })),
    };
});
vi.mock('../repositories/cats');

describe('Test CatsService', () => {
    const logger = new Logger();

    const pg = new Postgres(logger);
    const redis = new Redis(logger);

    const bull = new Bull(redis, logger);
    const catsRepository = new CatsRepository(pg);

    const catsService = new CatsService(catsRepository, bull);

    it('should fetch all the cats', async () => {
        expect.assertions(2);

        vi.spyOn(catsRepository, 'getAll').mockImplementation(async (...args) => {
            expect(args).toMatchSnapshot();
            return [];
        });

        const res = await catsService.getAll();
        expect(res).toMatchSnapshot();
    });

    it('should fetch a single cat and pet it', async () => {
        expect.assertions(3);

        vi.spyOn(catsRepository, 'getById').mockImplementationOnce(async (...args) => {
            expect(args).toMatchSnapshot();
            return Promise.resolve({ name: 'Jake' } as CatDBItem);
        });

        vi.spyOn(bull.queues.catPetterQueue, 'add').mockImplementationOnce(async (...args) => {
            expect(args).toMatchSnapshot();
            return Promise.resolve({}) as Promise<Job<unknown, unknown>>;
        });

        const res = await catsService.getById('1');
        expect(res).toMatchSnapshot();
    });

    it("should fail fetching a single cat because it doesn't exist", async () => {
        expect.assertions(4);

        vi.spyOn(catsRepository, 'getById').mockImplementationOnce(async (...args) => {
            expect(args).toMatchSnapshot();
            return Promise.resolve(undefined);
        });

        const catPetterQueueAdd = vi.spyOn(bull.queues.catPetterQueue, 'add');

        try {
            await catsService.getById('1');
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect(error).toMatchSnapshot();
        }

        expect(catPetterQueueAdd).not.toBeCalled();
    });
});
