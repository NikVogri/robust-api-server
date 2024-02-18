import { describe, expect, it, vi } from 'vitest';
import { Postgres } from '../clients/postgres';
import { Logger } from '../clients/logger';
import { Model } from './base';

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

class TestModel extends Model<{ id: string }> {
    constructor(db: Postgres) {
        super('table-name', db);
    }
}

describe('Test abstract Model', () => {
    const logger = new Logger();
    const db = new Postgres(logger);

    const testModel = new TestModel(db);

    it('should get all the records for table', async () => {
        expect.assertions(2);

        vi.spyOn(db.pool, 'query').mockImplementationOnce(async (...args) => {
            expect(args).toMatchSnapshot();
            return Promise.resolve({
                rows: [{ id: 1 }, { id: 2 }],
            });
        });

        const res = await testModel.getAll();
        expect(res).toMatchSnapshot();
    });

    it('should get records by id', async () => {
        expect.assertions(2);

        vi.spyOn(db.pool, 'query').mockImplementationOnce(async (...args) => {
            expect(args).toMatchSnapshot();
            return Promise.resolve({
                rows: [{ id: 1 }, { id: 2 }],
            });
        });

        const res = await testModel.getById('1');
        expect(res).toMatchSnapshot();
    });

    it('should delete records by id', async () => {
        expect.assertions(2);

        vi.spyOn(db.pool, 'query').mockImplementationOnce(async (...args) => {
            expect(args).toMatchSnapshot();
            return Promise.resolve();
        });

        const res = await testModel.delete('1');
        expect(res).toMatchSnapshot();
    });
});
