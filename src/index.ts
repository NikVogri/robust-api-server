import 'reflect-metadata';
import Container from 'typedi';

import { startApiServer } from './server';
import { Postgres } from './clients/postgres';
import { config } from 'dotenv';
import { Redis } from './clients/redis';
import { Bull } from './clients/bull';

config();

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT?: string;
            PG_DB_CONN_STR?: string;
        }
    }
}

(async () => {
    // Start initial services (init connections, start server, etc...)
    const pg = Container.get(Postgres);
    await pg.connect();

    Container.get(Redis);
    Container.get(Bull);

    startApiServer();
})();
