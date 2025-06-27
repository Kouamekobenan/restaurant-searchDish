import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { RestaurantDish } from 'src/restaurantDish/domain/entities/restaurantDish.entity';
import {
  IRestaurantDishRepository,
  RestaurantDishRepositoryName,
} from 'src/restaurantDish/domain/interfaces/dishRestaurant-repository.interface';

@Injectable()
export class GetRestaurantDishUseCase {
  private readonly logger = new Logger(GetRestaurantDishUseCase.name);
  constructor(
    @Inject(RestaurantDishRepositoryName)
    private readonly restaurantDishRepository: IRestaurantDishRepository,
  ) {}
  async execute(id: string): Promise<RestaurantDish> {
    try {
      return await this.restaurantDishRepository.getId(id);
    } catch (error) {
      this.logger.error('Failled to retrieve restaurant dish by ID', error);
      throw new BadRequestException(
        'Failled to retrieve restaurant by ID',
        error.message,
      );
    }
  }
}
