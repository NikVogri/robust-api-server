import { Service } from 'typedi';
import { CatsService } from '../services/cats';
import { Request, Response } from 'express';

@Service()
export class CatsController {
    constructor(private catsService: CatsService) {}

    async getAll(_: Request, res: Response) {
        const cats = await this.catsService.getAll();
        res.status(200).send(cats);
    }

    async getById(req: Request, res: Response) {
        const id = req.params.id;
        const cat = await this.catsService.getById(id);

        res.status(200).send(cat);
    }
}
