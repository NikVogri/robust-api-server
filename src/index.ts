import 'reflect-metadata';
import { config } from 'dotenv';
config();

import { startApiServer } from './server';
import { Postgres } from './clients/postgres';
import { container } from 'tsyringe';
import { Bull } from './clients/bull';
import { Redis } from './clients/redis';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT?: string;
            PG_DB_CONN_STR?: string;
            REDIS_DB_CONNECTION_STR?: string;
        }
    }
}

(async () => {
    // Start initial services (init connections, start server, etc...)
    const postgres = container.resolve(Postgres);
    await postgres.testConnection();

    const redis = container.resolve(Redis);
    await redis.testConnection();

    container.resolve(Bull);

    startApiServer();
})();
