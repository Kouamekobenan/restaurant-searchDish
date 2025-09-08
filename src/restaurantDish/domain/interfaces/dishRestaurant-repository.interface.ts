import { CreateRestaurantDishDto } from 'src/restaurantDish/application/dtos/create-restaurantDishDto';
import { RestaurantDish } from '../entities/restaurantDish.entity';
import { UpdateRestaurantDishDto } from 'src/restaurantDish/application/dtos/update-restaurantDish';
import { RestaurantDishWithNamesDto } from 'src/restaurantDish/application/dtos/search-restau.dto';

export const RestaurantDishRepositoryName = 'IRestaurantDishRepository';
export interface IRestaurantDishRepository {
  create(createDto: CreateRestaurantDishDto): Promise<RestaurantDish>;
  update(
    id: string,
    updateDto: UpdateRestaurantDishDto,
  ): Promise<RestaurantDish>;
  getId(id: string): Promise<RestaurantDish>;
  pagination(
    page: number,
    limit: number,
    countryName:string,
  ): Promise<{
    data: RestaurantDish[];
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  }>;
  getAll(countryName:string): Promise<RestaurantDish[]>;
  delete(id: string): Promise<void>;
  search(
    page: number,
    limit: number,
    dishId: string,
  ): Promise<{
    data: RestaurantDishWithNamesDto[];
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  }>;
  findDishbyRestaurant(restaurantId: string): Promise<RestaurantDish[]>;
}
