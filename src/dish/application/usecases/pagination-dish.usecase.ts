import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  DishRepositoryName,
  IDishRepository,
} from 'src/dish/domain/interfaces/dish-repository.interface';

@Injectable()
export class PaginationDishUseCase {
  constructor(
    @Inject(DishRepositoryName)
    private readonly dishRepository: IDishRepository,
  ) {}
  async execute(page: number, limit: number) {
    try {
      const dish = await this.dishRepository.pagination(page, limit);
      return dish;
    } catch (error) {
      throw new BadRequestException('Failled to pagination dish', {
        cause: error,
        description: error.message,
      });
    }
  }
}
