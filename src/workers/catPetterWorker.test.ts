import { describe, expect, it, vi } from 'vitest';
import { Logger } from '../services/logging/logger';
import { Job } from 'bullmq';
import { catPetterWorker } from './catPetterWorker';
import { container } from 'tsyringe';

vi.mock('../services/logging/logger', () => {
    const Logger = vi.fn(() => ({
        info: vi.fn(),
    }));

    return { Logger };
});

describe('Test catPetterWorker', () => {
    container.registerInstance(Logger, new Logger());
    const logger = container.resolve(Logger);

    it('should pet the cat', async () => {
        expect.assertions(3);

        vi.spyOn(logger, 'info').mockImplementationOnce((...args) => {
            expect(args).toMatchSnapshot();
            return undefined;
        });

        vi.spyOn(logger, 'info').mockImplementationOnce((...args) => {
            expect(args).toMatchSnapshot();
            return undefined;
        });

        const job = {
            data: {
                name: 'Bob',
            },
        } as Job;

        const res = await catPetterWorker(job);
        expect(res).toMatchSnapshot();
    });
});
