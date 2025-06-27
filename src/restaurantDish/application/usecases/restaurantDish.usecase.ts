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
export class PaginationDishUseCase {
  private readonly logger = new Logger(PaginationDishUseCase.name);
  constructor(
    @Inject(RestaurantDishRepositoryName)
    private readonly restaurantDishRepository: IRestaurantDishRepository,
  ) {}
  async execute(page: number, limit: number) {
    try {
      const restaurantDishs = await this.restaurantDishRepository.pagination(
        page,
        limit,
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
