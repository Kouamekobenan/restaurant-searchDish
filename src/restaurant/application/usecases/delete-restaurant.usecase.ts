import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { unlink } from 'fs/promises'; 
import { join } from 'path';
import {
  IRestaurantRepository,
  RestaurantRepositoryName,
} from 'src/restaurant/domain/interfaces/restaurant.interface';

@Injectable()
export class DeleteRestaurantUseCase {
  private readonly logger = new Logger(DeleteRestaurantUseCase.name);

  constructor(
    @Inject(RestaurantRepositoryName)
    private readonly restaurantRepository: IRestaurantRepository,
  ) {}

  async execute(id: string): Promise<boolean> {
    try {
      const restaurant = await this.restaurantRepository.findById(id);

      if (!restaurant) {
        throw new NotFoundException(`Restaurant not found ${id}`);
      }
      const image = restaurant.getImages();

      if (image && image.includes('restaurant')) {
        const imagePath = join(
          process.cwd(),
          image.startsWith('/') ? image.slice(1) : image,
        );

        try {
          await unlink(imagePath);
          this.logger.log(`Image supprimée : ${imagePath}`);
        } catch (error) {
          this.logger.warn('Erreur suppression image : ' + error.message);
        }
      } else {
        this.logger.warn('Image non supprimée : chemin non reconnu ou vide.');
      }
      await this.restaurantRepository.restauDelete(id);
      return true;
    } catch (error) {
      this.logger.error('Failed to delete restaurant', error.stack);
      throw new BadRequestException('Failed to delete restaurant', {
        cause: error,
        description: error.message,
      });
    }
  }
}
