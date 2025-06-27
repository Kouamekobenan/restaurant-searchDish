import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IRestaurantDishRepository,
  RestaurantDishRepositoryName,
} from 'src/restaurantDish/domain/interfaces/dishRestaurant-repository.interface';
import { UpdateRestaurantDishDto } from '../dtos/update-restaurantDish';
import { RestaurantDish } from 'src/restaurantDish/domain/entities/restaurantDish.entity';

@Injectable()
export class UpdateRestaurantDisuUseCase {
  constructor(
    @Inject(RestaurantDishRepositoryName)
    private readonly restaurantDishRepository: IRestaurantDishRepository,
  ) {}
  async execute(
    id: string,
    updateDto: UpdateRestaurantDishDto,
  ): Promise<RestaurantDish> {
    try {
      const restau = await this.restaurantDishRepository.getId(id);
      if (!restau) {
        throw new NotFoundException('Restaurant dish not found!');
      }
      return await this.restaurantDishRepository.update(id, updateDto);
    } catch (error) {
      throw new BadRequestException('Failled to update restaurant dish', {
        cause: error,
        description: error.message,
      });
    }
  }
}
