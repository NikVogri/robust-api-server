import { Redis as IORedis } from 'ioredis';
import { Service } from 'typedi';
import { Logger } from './logger';

@Service()
export class Redis {
    client: IORedis;

    constructor(private logger: Logger) {
        this.client = new IORedis({
            maxRetriesPerRequest: null,
        });

        logger.info('Successfully connected to Redis');
    }
}
