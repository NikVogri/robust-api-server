import { Redis as IORedis } from 'ioredis';
import { Logger } from '../logging/logger';
import { singleton } from 'tsyringe';

@singleton()
export class Redis {
    readonly client: IORedis;

    constructor(private logger: Logger) {
        this.client = new IORedis(process.env.REDIS_DB_CONNECTION_STR!, {
            maxRetriesPerRequest: null,
        });
    }

    async testConnection(): Promise<void> {
        await this.client.ping();
        this.logger.info('Successfully connected to Redis');
    }
}
