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
import { CreateRestaurantDishDto } from '../dtos/create-restaurantDishDto';
import { RestaurantDish } from 'src/restaurantDish/domain/entities/restaurantDish.entity';

@Injectable()
export class CreateRestaurantDishUseCase {
  private readonly logger = new Logger(CreateRestaurantDishUseCase.name);
  constructor(
    @Inject(RestaurantDishRepositoryName)
    private readonly restaurantRepository: IRestaurantDishRepository,
  ) {}
  async execute(createDto: CreateRestaurantDishDto): Promise<RestaurantDish> {
    try {
      const restaurantDish = await this.restaurantRepository.create(createDto);
      return restaurantDish;
    } catch (error) {
      this.logger.error('Failled to create restaurant dish', error.stack);
      throw new BadRequestException('Failled to create restaurant dish', {
        cause: error,
        description: error.message,
      });
    }
  }
}
