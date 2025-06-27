import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import {
  IRestaurantRepository,
  RestaurantRepositoryName,
} from 'src/restaurant/domain/interfaces/restaurant.interface';

@Injectable()
export class DeleteRestaurantUseCase {
  private readonly logger = new Logger(DeleteRestaurantUseCase.name);
  constructor(
    @Inject(RestaurantRepositoryName)
    private readonly restaurantRepository: IRestaurantRepository,
  ) {}
  async execute(id: string): Promise<boolean> {
    try {
      await this.restaurantRepository.restauDelete(id);
      return true;
    } catch (error) {
      this.logger.error('Failled to delete restaurant ', error.stack);
      throw new BadRequestException('Failled to delete restaurant ', {
        cause: error,
        description: error.message,
      });
    }
  }
}
