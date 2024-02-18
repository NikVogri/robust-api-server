import { CatDBItem } from '../models';
import { AppError } from '../error/AppError';
import { Bull } from '../clients/bull';
import { CatsRepository } from '../repositories/cats';
import { injectable } from 'tsyringe';
import { CreateCatDto } from '../routes/cats.dto';

@injectable()
export class CatsService {
    constructor(
        private catsRepo: CatsRepository,
        private bull: Bull,
    ) {}

    async getAll(): Promise<CatDBItem[]> {
        const cats = await this.catsRepo.getAll();
        return cats;
    }

    async getById(id: string): Promise<CatDBItem> {
        const cat = await this.catsRepo.getById(id);

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

    async createCat(createCatDto: CreateCatDto): Promise<CatDBItem> {
        const cat = await this.catsRepo.create(createCatDto);
        return cat;
    }
}
