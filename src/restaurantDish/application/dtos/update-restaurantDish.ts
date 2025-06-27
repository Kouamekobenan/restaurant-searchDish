import { PartialType } from '@nestjs/swagger';
import { CreateRestaurantDishDto } from './create-restaurantDishDto';
export class UpdateRestaurantDishDto extends PartialType(
  CreateRestaurantDishDto,
) {}
