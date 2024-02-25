import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import supertest from 'supertest';
import { Server } from 'http';
import { startApiServer } from '../server';
import { CatsService } from '../services/cats';
import { Bull } from '../services/async/bull';
import { CatsRepository } from '../repositories/cats';
import { container } from 'tsyringe';
import { Postgres } from '../services/database/postgres';
import { Logger } from '../services/logging/logger';
import { Redis } from '../services/database/redis';
import { CatDBItem } from '../models';

vi.mock('../clients/logger');
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
vi.mock('../clients/redis');
vi.mock('../clients/postgres', () => {
    return {
        Postgres: vi.fn(() => ({
            pool: {
                query: vi.fn(),
            },
        })),
    };
});

describe('Test cats routes', () => {
    let app: Server;

    beforeAll(() => {
        container.registerInstance(Logger, new Logger());
        container.registerInstance(Postgres, new Postgres(container.resolve(Logger)));
        container.registerInstance(Redis, new Redis(container.resolve(Logger)));
        container.registerInstance(Bull, new Bull(container.resolve(Redis), container.resolve(Logger)));
        container.registerInstance(CatsRepository, new CatsRepository(container.resolve(Postgres)));
        container.registerInstance(
            CatsService,
            new CatsService(container.resolve(CatsRepository), container.resolve(Bull)),
        );

        app = startApiServer();
    });

    afterAll(() => {
        container.reset();
        app.close();
    });

    test('GET /cats - successfully fetch all records', async () => {
        expect.assertions(3);

        vi.spyOn(container.resolve(Postgres).pool, 'query').mockImplementationOnce(async (...args) => {
            expect(args).toMatchSnapshot();
            return Promise.resolve({ rows: [{ id: 1 }, { id: 2 }] });
        });

        const res = await supertest(app).get(`/cats`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchSnapshot();
    });

    test('GET /cats/:id - successfully fetch an existing record', async () => {
        expect.assertions(4);

        const catId = 1;

        vi.spyOn(container.resolve(Postgres).pool, 'query').mockImplementationOnce(async (...args) => {
            expect(args).toMatchSnapshot();
            return Promise.resolve({ rows: [{ id: catId }] });
        });

        const catPetterQueueAdd = vi.spyOn(container.resolve(Bull).queues.catPetterQueue, 'add');

        const res = await supertest(app).get(`/cats/${catId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchSnapshot();
        expect(catPetterQueueAdd).toBeCalledTimes(1);
    });

    test('GET /cats/:id - fail due to record not found', async () => {
        expect.assertions(4);

        const catId = 100;

        vi.spyOn(container.resolve(Postgres).pool, 'query').mockImplementationOnce(async (...args) => {
            expect(args).toMatchSnapshot();
            return Promise.resolve({ rows: [] });
        });

        const catPetterQueueAdd = vi.spyOn(container.resolve(Bull).queues.catPetterQueue, 'add');

        const res = await supertest(app).get(`/cats/${catId}`);

        expect(catPetterQueueAdd).not.toBeCalled;
        expect(res.statusCode).toBe(404);
        expect(res.body).toMatchSnapshot();
    });

    test('POST /cats - successfully create a cat', async () => {
        expect.assertions(3);

        const cat = {
            name: 'Kitty-kat',
            dateOfBirth: '1990-01-01',
            color: 'orange',
        };

        vi.spyOn(container.resolve(Postgres).pool, 'query').mockImplementationOnce(async (...args) => {
            expect(args).toMatchSnapshot();
            return Promise.resolve({ rows: [{ id: 1 } as CatDBItem] });
        });

        const res = await supertest(app).post('/cats').send(cat);

        expect(res.statusCode).toBe(201);
        expect(res.body).toMatchSnapshot();
    });

    test('POST /cats - fail due to input validation error', async () => {
        expect.assertions(4);

        const res = await supertest(app).post('/cats').send(undefined);

        expect(res.statusCode).toBe(400);
        expect(res.body).toMatchSnapshot();

        const res2 = await supertest(app)
            .post('/cats')
            .send({ name: 'Kitty-kat', color: 'orange', dateOfBirth: 'invalid' });

        expect(res2.statusCode).toBe(400);
        expect(res2.body).toMatchSnapshot();
    });
});
