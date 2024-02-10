import { Postgres } from '../clients/postgres';

export abstract class Model<T> {
    constructor(
        protected table: string,
        protected db: Postgres,
    ) {}

    async getAll(): Promise<T[]> {
        const { rows } = await this.db.pool.query(`SELECT * FROM ${this.table}`);
        return rows;
    }

    async getById(id: string): Promise<T> {
        const { rows } = await this.db.pool.query(`SELECT * FROM ${this.table} WHERE id = $1`, [id]);
        return rows[0];
    }

    async delete(id: string): Promise<void> {
        await this.db.pool.query(`DELETE FROM ${this.table} WHERE id = $2`, [id]);
    }
}
