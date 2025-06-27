import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  IRestaurantDishRepository,
  RestaurantDishRepositoryName,
} from 'src/restaurantDish/domain/interfaces/dishRestaurant-repository.interface';

@Injectable()
export class DeleteRestaurantDishUseCase {
  private readonly logger = new Logger(DeleteRestaurantDishUseCase.name);
  constructor(
    @Inject(RestaurantDishRepositoryName)
    private readonly restaurantDishRepository: IRestaurantDishRepository,
  ) {}
  async execute(id: string): Promise<boolean> {
    try {
      const dish = await this.restaurantDishRepository.getId(id);
      if (!dish) {
        throw new NotFoundException('That restaurant dish not found');
      }
      await this.restaurantDishRepository.delete(id);
      return true;
    } catch (error) {
      this.logger.error('Failled to detlete restaurant dish', error.message);
      throw new BadRequestException('Failled to delete restaurant dish ', {
        cause: error,
        description: error.message,
      });
    }
  }
}
