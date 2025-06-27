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
export class FilterRestaurantUseCase {
  private readonly logger = new Logger(FilterRestaurantUseCase.name);
  constructor(
    @Inject(RestaurantDishRepositoryName)
    private readonly restau: IRestaurantDishRepository,
  ) {}
  async execute(page: number, limit: number, nameData: string) {
    try {
      const filters = await this.restau.search(page, limit, nameData);
      this.logger.log('Filter data! :', JSON.stringify(filters));
      return filters;
    } catch (error) {
      this.logger.error('Failled to filter restaurant dish', error);
      throw new BadRequestException('Failled to filter restaurant dish', {
        cause: error,
        description: error.message,
      });
    }
  }
}
