import { Job } from 'bullmq';
import Container from 'typedi';
import { Logger } from '../clients/logger';

export const catPetterWorker = async (job: Job) => {
    const logger = Container.get(Logger);

    logger.info('Started to pet a cat ' + job.data.name);
    await new Promise((r) => setTimeout(r, 3000));
    logger.info('Completed petting cat ' + job.data.name);

    return true;
};
