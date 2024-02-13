import 'reflect-metadata';
import { config } from 'dotenv';
config();

import Container from 'typedi';
import { startApiServer } from './server';
import { Postgres } from './clients/postgres';

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
    const pg = Container.get(Postgres);
    await pg.connect();

    startApiServer();
})();
