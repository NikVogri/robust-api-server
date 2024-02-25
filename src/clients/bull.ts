import { Job, Queue, Worker, WorkerOptions } from 'bullmq';
import { Redis } from './redis';
import { Logger } from './logger';
import { singleton } from 'tsyringe';

type QueueName = 'catPetterQueue';
type BullQueues = Record<QueueName, Queue<unknown, unknown, string>>;

@singleton()
export class Bull {
    readonly queues: BullQueues;

    constructor(
        private redis: Redis,
        private logger: Logger,
    ) {
        this.queues = {
            catPetterQueue: new Queue('catPetterQueue', { connection: this.redis.client }),
        };

        this.logger.info('Successfully initiated Bull queues');
    }

    public registerWorker(
        queue: QueueName,
        handler: (j: Job) => Promise<boolean>,
        opts: Omit<WorkerOptions, 'connection'>,
    ) {
        // In most cases workers should be running on seperate threads than the one the API is on
        new Worker(queue, handler, { connection: this.redis.client, ...opts });
        this.logger.info(`Successfully registered new worker for queue "${queue}"`);
    }
}
