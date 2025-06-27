import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  IRestaurantRepository,
  RestaurantRepositoryName,
} from 'src/restaurant/domain/interfaces/restaurant.interface';

@Injectable()
export class PaginationRestaurantUseCase {
  private readonly logger = new Logger(PaginationRestaurantUseCase.name);
  constructor(
    @Inject(RestaurantRepositoryName)
    private readonly restaurantRepository: IRestaurantRepository,
  ) {}
  async execute(page: number, limit: number) {
    try {
      const restaurants = await this.restaurantRepository.paginate(page, limit);
      return restaurants;
    } catch (error) {
      this.logger.error('Failled to pagination restaurant', error.stack);
      throw new BadRequestException('Failled to pagination restaurant', {
        cause: error,
        description: error.message,
      });
    }
  }
}
