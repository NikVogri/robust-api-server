import express, { Response } from 'express';
import { withErrorHandling } from '../middleware/withCatch';
import { container } from 'tsyringe';
import { withValidate } from '../middleware/withValidate';
import { createCatSchema } from './cats.dto';
import { CatsService } from '../services/cats';
import { Cat } from '../openapi/models';

const catsRouter = express.Router();

catsRouter.get(
    '/cats',
    withErrorHandling(async (_, res: Response<Cat[]>) => {
        const catsService = container.resolve(CatsService);

        const cats = await catsService.getAll();
        res.status(200).send(cats);
    }),
);

catsRouter.get(
    '/cats/:id',
    withErrorHandling(async (req, res: Response<Cat>) => {
        const catsService = container.resolve(CatsService);

        const id = req.params.id;
        const cat = await catsService.getById(id);

        res.status(200).send(cat);
    }),
);

catsRouter.post(
    '/cats',
    withValidate({ body: createCatSchema }),
    withErrorHandling(async (req, res: Response<Cat>) => {
        const catsService = container.resolve(CatsService);

        const cat = await catsService.createCat(req.body);
        res.status(201).send(cat);
    }),
);

export { catsRouter };
