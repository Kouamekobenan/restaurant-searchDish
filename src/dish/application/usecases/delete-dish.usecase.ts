import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  DishRepositoryName,
  IDishRepository,
} from 'src/dish/domain/interfaces/dish-repository.interface';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class DeleteDishUseCase {
  private readonly logger = new Logger(DeleteDishUseCase.name);

  constructor(
    @Inject(DishRepositoryName)
    private readonly dishRepository: IDishRepository,
  ) {}

  async execute(id: string): Promise<boolean> {
    try {
      const dish = await this.dishRepository.getById(id);
      if (!dish) {
        throw new NotFoundException('Dish not found');
      }

      if (dish.getImage()) {
        const imagePath = join(
          process.cwd(),
          dish.getImage()!,
        );
        try {
          await unlink(imagePath);
          this.logger.log(`Image supprimée : ${imagePath}`);
        } catch (error) {
          this.logger.warn(
            'Erreur lors de la suppression du fichier image : ' + error.message,
          );
        }
      }

      await this.dishRepository.delete(id);
      return true;
    } catch (error) {
      this.logger.error('Échec de la suppression du plat', error.message);
      throw new BadRequestException('Échec de la suppression du plat', {
        cause: error,
        description: error.message,
      });
    }
  }
}
