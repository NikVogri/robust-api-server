import { Pool } from 'pg';
import { Logger } from './logger';
import { singleton } from 'tsyringe';

@singleton()
export class Postgres {
    readonly pool: Pool;

    constructor(private logger: Logger) {
        this.pool = new Pool({
            connectionString: process.env.PG_DB_CONNECTION_STR,
        });
    }

    async testConnection(): Promise<void> {
        await this.pool.query('SELECT 1 + 1;');
        this.logger.info('Successfully connected to Postgres');
    }

    async getClient() {
        return await this.pool.connect();
    }
}
