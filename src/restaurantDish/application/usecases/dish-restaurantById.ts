import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { RestaurantDish } from 'src/restaurantDish/domain/entities/restaurantDish.entity';
import { RestaurantDishRepositoryName } from 'src/restaurantDish/domain/interfaces/dishRestaurant-repository.interface';
import { RestaurantDishRepository } from 'src/restaurantDish/infrastructure/restaurantDish-repository.impl';

@Injectable()
export class FindDishbyRestaurantByIdUseCase {
  private readonly logger = new Logger(FindDishbyRestaurantByIdUseCase.name);
  constructor(
    @Inject(RestaurantDishRepositoryName)
    private readonly restaurantDishRepo: RestaurantDishRepository,
  ) {}
  async execute(restaurantId: string): Promise<RestaurantDish[]> {
    try {
      return await this.restaurantDishRepo.findDishbyRestaurant(restaurantId);
    } catch (error) {
      this.logger.error('Failled to retrieve data to restaurant by ID');
      throw new BadRequestException(
        'Failled to retrieve data to restaurant by ID',
        {
          cause: error,
          description: error.message,
        },
      );
    }
  }
}
