import { Repository } from './repository';
import { CatDBItem } from '../models';
import { Postgres } from '../services/database/postgres';
import { injectable } from 'tsyringe';
import { CreateCatDto } from '../routes/cats.dto';
import { AppError } from '../error/AppError';

@injectable()
export class CatsRepository extends Repository<CatDBItem> {
    constructor(pg: Postgres) {
        super('cats', pg);
    }

    async create(createCatDto: CreateCatDto): Promise<CatDBItem> {
        try {
            const { rows } = await this.pg.pool.query(
                `
                INSERT INTO cats (name, date_of_birth, color)
                VALUES ($1, $2, $3)
                RETURNING *;
                `,
                [createCatDto.name, createCatDto.dateOfBirth, createCatDto.color],
            );

            return rows[0];
        } catch (err) {
            throw new AppError({
                message: 'Unable to create a new cat',
                statusCode: 500,
                thrownError: err,
            });
        }
    }
}
