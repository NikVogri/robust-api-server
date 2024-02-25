import { Repository } from './repository';
import { CatDBItem } from '../models';
import { Postgres } from '../clients/postgres';
import { injectable } from 'tsyringe';
import { CreateCatDto } from '../routes/cats.dto';

@injectable()
export class CatsRepository extends Repository<CatDBItem> {
    constructor(pg: Postgres) {
        super('cats', pg);
    }

    async create(createCatDto: CreateCatDto): Promise<CatDBItem> {
        const { rows } = await this.pg.pool.query(
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
