import { Postgres } from '../clients/postgres';

export abstract class Repository<T> {
    constructor(
        protected table: string,
        protected pg: Postgres,
    ) {}

    async getAll(): Promise<T[]> {
        const { rows } = await this.pg.pool.query(`SELECT * FROM ${this.table}`);
        return rows;
    }

    async getById(id: string): Promise<T | undefined> {
        const { rows } = await this.pg.pool.query(`SELECT * FROM ${this.table} WHERE id = $1`, [id]);
        return rows[0];
    }

    async delete(id: string): Promise<void> {
        await this.pg.pool.query(`DELETE FROM ${this.table} WHERE id = $1`, [id]);
    }
}
