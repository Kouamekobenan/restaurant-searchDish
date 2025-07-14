import { RestaurantDto } from 'src/restaurant/application/dtos/create-restaurant.dto';
import { Restaurant } from '../entities/restaurant.entity';
import { UpdateRestaurantDto } from 'src/restaurant/application/dtos/update-restaurant.dto';

export const RestaurantRepositoryName = 'IRestaurantRepository';
export interface IRestaurantRepository {
  create(createDto: RestaurantDto): Promise<Restaurant>;
  update(id: string, updateDto: UpdateRestaurantDto): Promise<Restaurant>;
  paginate(
    page: number,
    limit: number,
  ): Promise<{
    data: Restaurant[];
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  }>;
  getAll(): Promise<Restaurant[]>;
  restauDelete(id: string): Promise<void>;
  findById(id: string): Promise<Restaurant>;
  deactive(id: string): Promise<void>;
  active(id: string): Promise<void>;
}
