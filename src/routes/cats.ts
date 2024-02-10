import express from 'express';
import { withErrorHandling } from '../middleware/withCatch';
import { CatsService } from '../services/cats';
import Container from 'typedi';

const catsRouter = express.Router();

catsRouter.get(
    '/cats',
    withErrorHandling(async (_, res) => {
        const catsService = Container.get(CatsService);

        const cats = await catsService.getAll();
        res.status(200).send(cats);
    }),
);

catsRouter.get(
    '/cats/:id',
    withErrorHandling(async (req, res) => {
        const catsService = Container.get(CatsService);

        const id = req.params.id;
        const cat = await catsService.getById(id);

        res.status(200).send(cat);
    }),
);

export { catsRouter };
