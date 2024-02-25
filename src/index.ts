import 'reflect-metadata';
import { config } from 'dotenv';
config();

import { startApiServer } from './server';
import { Postgres } from './services/database/postgres';
import { container } from 'tsyringe';
import { Bull } from './services/async/bull';
import { Redis } from './services/database/redis';
import { catPetterWorker } from './workers/catPetterWorker';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT?: string;
            PG_DB_CONNECTION_STR?: string;
            REDIS_DB_CONNECTION_STR?: string;
        }
    }
    namespace Express {
        export interface Request {
            thrownError?: Error;
            // Extend global request type with properties
            // e.g. user?: {id: string;}
        }
    }
}

(async () => {
    // Start initial services (init connections, start server, etc...)
    const postgres = container.resolve(Postgres);
    await postgres.testConnection();

    const redis = container.resolve(Redis);
    await redis.testConnection();

    const bull = container.resolve(Bull);
    bull.registerWorker('catPetterQueue', catPetterWorker, { concurrency: 30 });

    startApiServer();
})();
