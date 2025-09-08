import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RestaurantDish } from 'src/restaurantDish/domain/entities/restaurantDish.entity';
import {
  IRestaurantDishRepository,
  RestaurantDishRepositoryName,
} from 'src/restaurantDish/domain/interfaces/dishRestaurant-repository.interface';

@Injectable()
export class FindAllRestaurantDishUseCase {
  constructor(
    @Inject(RestaurantDishRepositoryName)
    private readonly restaurantDishRepository: IRestaurantDishRepository,
  ) {}
  async execute(countryName:string): Promise<RestaurantDish[]> {
    try {
      return await this.restaurantDishRepository.getAll(countryName);
    } catch (error) {
      throw new BadRequestException('Failled to retrieve restaurant dish', {
        cause: error,
        description: error.message,
      });
    }
  }
}
