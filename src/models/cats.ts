import { Service } from 'typedi';

import { Model } from './base';
import { Cat } from './types';
import { Postgres } from '../clients/postgres';

@Service()
export class CatsModel extends Model<Cat> {
    constructor(db: Postgres) {
        super('cats', db);
    }
}
