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
import { UpdateRestaurantDto } from '../dtos/update-restaurant.dto';
import { Restaurant } from 'src/restaurant/domain/entities/restaurant.entity';

@Injectable()
export class UpdateRestaurantUseCase {
  private readonly logger = new Logger(UpdateRestaurantUseCase.name);
  constructor(
    @Inject(RestaurantRepositoryName)
    private readonly restaurantRepository: IRestaurantRepository,
  ) {}
  async execute(
    id: string,
    updateDto: UpdateRestaurantDto,
    imagePath?: string,
  ): Promise<Restaurant> {
    try {
      const restaurantData = await this.restaurantRepository.update(id, {
        ...updateDto,
        image: imagePath,
      });
      this.logger.log(
        `This is data update restaurant:${JSON.stringify(restaurantData)}`,
      );
      return restaurantData;
    } catch (error) {
      this.logger.error(`Failled to update restaurant data`, error.stack);
      throw new BadRequestException('Failled to update restaurant', {
        cause: error,
        description: error.message,
      });
    }
  }
}
