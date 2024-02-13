import express from 'express';
import { withErrorHandling } from '../middleware/withCatch';
import Container from 'typedi';
import { CatsController } from '../controllers/cats';

const catsRouter = express.Router();
const catsController = Container.get(CatsController);

catsRouter.get(
    '/cats',
    withErrorHandling((req, res) => catsController.getAll(req, res)),
);

catsRouter.get(
    '/cats/:id',
    withErrorHandling((req, res) => catsController.getById(req, res)),
);

export { catsRouter };
