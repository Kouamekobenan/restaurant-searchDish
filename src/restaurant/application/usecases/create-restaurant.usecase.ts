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
import { RestaurantDto } from '../dtos/create-restaurant.dto';
import { Restaurant } from 'src/restaurant/domain/entities/restaurant.entity';
@Injectable()
export class CreateRestaurantUseCase {
  private readonly logger = new Logger(CreateRestaurantUseCase.name);
  constructor(
    @Inject(RestaurantRepositoryName)
    private readonly restaurantRepository: IRestaurantRepository,
  ) {}
  async execute(createDto: RestaurantDto): Promise<Restaurant> {
    try {
      const restaurant = await this.restaurantRepository.create(createDto);
      return restaurant;
    } catch (error) {
      this.logger.error('Failled to create restaurant', error.stack);
      throw new BadRequestException('Failled to create restaurant', {
        cause: error,
        description: error.message,
      });
    }
  }
}
