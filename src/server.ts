import express, { Response } from 'express';
import { catsRouter } from './routes/cats';
import { errorMiddleware } from './middleware/errorMiddleware';
import { loggingMiddleware } from './middleware/loggingMiddleware';
import { Logger } from './clients/logger';
import { container } from 'tsyringe';

export const startApiServer = () => {
    const logger = container.resolve(Logger);
    const app = express();

    // Set middleware
    app.use(express.json());
    app.use(loggingMiddleware);

    // Set HTTP headers

    // Set routers
    app.use(catsRouter);

    // Set debug endpoints
    app.get('/status', (_, res: Response) => {
        res.status(200).send({ time: Date.now() });
    });

    // Set error middleware
    app.use(errorMiddleware);

    const PORT = process.env.PORT;
    return app.listen(PORT, () => logger.info('Server started listening on port ' + PORT));
};
