import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Restaurant } from 'src/restaurant/domain/entities/restaurant.entity';
import {
  IRestaurantRepository,
  RestaurantRepositoryName,
} from 'src/restaurant/domain/interfaces/restaurant.interface';

@Injectable()
export class GetAllRestaurantUseCase {
  private readonly logger = new Logger(GetAllRestaurantUseCase.name);
  constructor(
    @Inject(RestaurantRepositoryName)
    private readonly restaurantRepository: IRestaurantRepository,
  ) {}
  async execute(): Promise<Restaurant[]> {
    try {
      const restaurants = await this.restaurantRepository.getAll();
      return restaurants;
    } catch (error) {
      this.logger.error('Failled to retrieve restaurants', error.stack);
      throw new BadRequestException('Failled to rretrieve restaurants ', {
        cause: error,
        description: error.message,
      });
    }
  }
}
