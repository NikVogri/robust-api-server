import { Model } from './base';
import { Cat } from './types';
import { Postgres } from '../clients/postgres';
import { injectable } from 'tsyringe';
import { CreateCatDto } from '../routes/cats.dto';

@injectable()
export class CatsModel extends Model<Cat> {
    constructor(db: Postgres) {
        super('cats', db);
    }

    async create(createCatDto: CreateCatDto): Promise<Cat> {
        const { rows } = await this.db.pool.query(
            `
                INSERT INTO cats (name, date_of_birth, color)
                VALUES ($1, $2, $3)
                RETURNING *;
                `,
            [createCatDto.name, createCatDto.dateOfBirth, createCatDto.color],
        );

        return rows[0];
    }
}
