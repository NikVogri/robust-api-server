import { describe, expect, it, vi } from 'vitest';
import { Postgres } from '../services/database/postgres';
import { Logger } from '../services/logging/logger';
import { Repository } from './repository';

vi.mock('../clients/logger');
vi.mock('../clients/postgres', () => {
    return {
        Postgres: vi.fn(() => ({
            pool: {
                query: vi.fn(),
            },
        })),
    };
});

class TestRepo extends Repository<{ id: string }> {
    constructor(pg: Postgres) {
        super('table-name', pg);
    }
}

describe('Test abstract Repository', () => {
    const logger = new Logger();
    const pg = new Postgres(logger);

    const testRepo = new TestRepo(pg);

    it('should get all the records for table', async () => {
        expect.assertions(2);

        vi.spyOn(pg.pool, 'query').mockImplementationOnce(async (...args) => {
            expect(args).toMatchSnapshot();
            return Promise.resolve({
                rows: [{ id: 1 }, { id: 2 }],
            });
        });

        const res = await testRepo.getAll();
        expect(res).toMatchSnapshot();
    });

    it('should get records by id', async () => {
        expect.assertions(2);

        vi.spyOn(pg.pool, 'query').mockImplementationOnce(async (...args) => {
            expect(args).toMatchSnapshot();
            return Promise.resolve({
                rows: [{ id: 1 }, { id: 2 }],
            });
        });

        const res = await testRepo.getById('1');
        expect(res).toMatchSnapshot();
    });

    it('should delete records by id', async () => {
        expect.assertions(2);

        vi.spyOn(pg.pool, 'query').mockImplementationOnce(async (...args) => {
            expect(args).toMatchSnapshot();
            return Promise.resolve();
        });

        const res = await testRepo.delete('1');
        expect(res).toMatchSnapshot();
    });
});
