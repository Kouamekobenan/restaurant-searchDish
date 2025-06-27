import { DishDto } from 'src/dish/application/dtos/create-dish.dto';
import { Dish } from '../entities/dish.entity';
import { UpdateDishDto } from 'src/dish/application/dtos/update-dish.dto';

export const DishRepositoryName = 'IDishRepository';
export interface IDishRepository {
  create(createDto: DishDto): Promise<Dish>;
  findAll(): Promise<Dish[]>;
  pagination(
    page: number,
    limit: number,
  ): Promise<{
    data: Dish[];
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  }>;
  update(id: string, updateDto: UpdateDishDto): Promise<Dish>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<Dish>;
}

