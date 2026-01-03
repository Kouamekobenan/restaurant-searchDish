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
export class PaginationDishNameUseCase {
  private readonly logger = new Logger(PaginationDishNameUseCase.name);
  constructor(
    @Inject(RestaurantDishRepositoryName)
    private readonly restaurantDishRepository: IRestaurantDishRepository,
  ) {}
  async execute(page: number, limit: number, dishName: string) {
    try {
      const restaurantDishs = await this.restaurantDishRepository.getDish(
        page,
        limit,
        dishName,
      );
      return restaurantDishs;
    } catch (error) {
      this.logger.error(`Failled to pagination restaurant usecases`, error);
      throw new BadRequestException(
        'Failled to pagination restaurant usecases',
        {
          cause: error,
          description: error.message,
        },
      );
    }
  }
}
