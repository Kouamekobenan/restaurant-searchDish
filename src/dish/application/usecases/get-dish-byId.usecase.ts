import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Dish } from 'src/dish/domain/entities/dish.entity';
import {
  DishRepositoryName,
  IDishRepository,
} from 'src/dish/domain/interfaces/dish-repository.interface';

@Injectable()
export class GetDishByIdUseCase {
  constructor(
    @Inject(DishRepositoryName)
    private readonly dishRepository: IDishRepository,
  ) {}
  async execute(id: string): Promise<Dish> {
    try {
      const dish = await this.dishRepository.getById(id);
      return dish;
    } catch (error) {
      throw new BadRequestException('Failled to retrieve dish by ID', {
        cause: error,
        description: error.message,
      });
    }
  }
}
