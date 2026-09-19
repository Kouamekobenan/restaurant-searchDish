import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  IRestaurantDishRepository,
  RestaurantDishRepositoryName,
} from 'src/restaurantDish/domain/interfaces/dishRestaurant-repository.interface';

@Injectable()
export class FindRestaurantDishByDishNameUseCase {
  private readonly logger = new Logger(FindRestaurantDishByDishNameUseCase.name);
  constructor(
    @Inject(RestaurantDishRepositoryName)
    private readonly restaurantDishRepo: IRestaurantDishRepository,
  ) {}
  async execute(page: number, limit: number, dishName?: string, city?: string) {
    try {
      return await this.restaurantDishRepo.findByDishName(page, limit, dishName, city);
    } catch (error) {
      this.logger.error('Failled to search restaurant dish by dish name', error);
      throw new BadRequestException(
        'Failled to search restaurant dish by dish name',
        {
          cause: error,
          description: error.message,
        },
      );
    }
  }
}
