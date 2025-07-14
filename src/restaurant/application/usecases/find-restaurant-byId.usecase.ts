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
export class FindRestaurantByIdUseCase {
  private readonly logger = new Logger(FindRestaurantByIdUseCase.name);
  constructor(
    @Inject(RestaurantRepositoryName)
    private readonly restaurantRepo: IRestaurantRepository,
  ) {}
  async execute(id: string): Promise<Restaurant> {
    try {
      return await this.restaurantRepo.findById(id);
    } catch (error) {
      this.logger.error('Failled to retrieve restaurant ', error.message);
      throw new BadRequestException(`Failled to retrieve restaurant`, {
        cause: error,
        description: error.message,
      });
    }
  }
}
