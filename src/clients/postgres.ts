import { Pool } from 'pg';
import { Service } from 'typedi';
import { Logger } from './logger';

@Service()
export class Postgres {
    public pool: Pool;

    constructor(private logger: Logger) {
        this.pool = new Pool({
            connectionString: process.env.PG_DB_CONN_STR,
        });
    }

    async connect() {
        const conn = await this.pool.connect();

        // Test connection
        await conn.query('SELECT 1 + 1');

        this.logger.info('Successfully connected to the database');
        return conn;
    }
}
