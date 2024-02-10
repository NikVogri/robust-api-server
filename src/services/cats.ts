import { Service } from 'typedi';
import { Cat } from '../models/types';
import { AppError } from '../error/AppError';
import { Bull } from '../clients/bull';
import { CatsModel } from '../models/cats';

@Service()
export class CatsService {
    constructor(
        private catsModel: CatsModel,
        private bull: Bull,
    ) {}

    async getAll(): Promise<Cat[]> {
        const cats = await this.catsModel.getAll();
        return cats;
    }

    async getById(id: string): Promise<Cat> {
        const cat = await this.catsModel.getById(id);

        if (!cat) {
            throw new AppError({
                message: 'Cat does not exist :(',
                statusCode: 404,
            });
        }

        // don't forget to pet the cat
        await this.bull.queues.catPetterQueue.add('pet-cat', { name: cat.name });

        return cat;
    }
}
