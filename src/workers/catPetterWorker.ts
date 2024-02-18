import { Job } from 'bullmq';
import { Logger } from '../clients/logger';
import { container } from 'tsyringe';

export const catPetterWorker = async (job: Job) => {
    const logger = container.resolve(Logger);

    logger.info('Started to pet a cat ' + job.data.name);
    await new Promise((r) => setTimeout(r, 100));
    logger.info('Completed petting cat ' + job.data.name);

    return true;
};
