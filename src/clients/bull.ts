import { Queue, Worker } from 'bullmq';
import { Redis } from './redis';
import { Service } from 'typedi';
import { catPetterWorker } from '../workers/catPetterWorker';
import { Logger } from './logger';

type QueueName = 'catPetterQueue';
type BullQueues = Record<QueueName, Queue<unknown, unknown, string>>;

@Service()
export class Bull {
    queues: BullQueues;

    constructor(
        private redis: Redis,
        private logger: Logger,
    ) {
        this.queues = this.createQueues();
        this.createWorkers();

        logger.info('Successfully initiated Bull queues and workers');
    }

    private createQueues(): BullQueues {
        return {
            catPetterQueue: new Queue('catPetterQueue', { connection: this.redis.client }),
        };
    }

    private createWorkers() {
        // In most cases workers should be running on seperate threads than the one the API is on
        new Worker('catPetterQueue', catPetterWorker, { connection: this.redis.client, concurrency: 30 });
    }
}
