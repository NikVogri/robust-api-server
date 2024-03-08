import { AppError } from '../error/AppError';
import { Postgres } from '../services/database/postgres';

export abstract class Repository<T> {
    constructor(
        protected table: string,
        protected pg: Postgres,
    ) {}

    async getAll(): Promise<T[]> {
        try {
            const { rows } = await this.pg.pool.query(`SELECT * FROM ${this.table}`);
            return rows;
        } catch (err) {
            throw new AppError({
                message: `Unable to get all records from ${this.table} table`,
                statusCode: 500,
                thrownError: err,
            });
        }
    }

    async getById(id: string): Promise<T | undefined> {
        try {
            const { rows } = await this.pg.pool.query(`SELECT * FROM ${this.table} WHERE id = $1`, [id]);
            return rows[0];
        } catch (err) {
            throw new AppError({
                message: `Unable to get record by id from ${this.table} table`,
                statusCode: 500,
                thrownError: err,
            });
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.pg.pool.query(`DELETE FROM ${this.table} WHERE id = $1`, [id]);
        } catch (err) {
            throw new AppError({
                message: `Unable to delete a record from ${this.table} table`,
                statusCode: 500,
                thrownError: err,
            });
        }
    }
}
