import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  DishRepositoryName,
  IDishRepository,
} from 'src/dish/domain/interfaces/dish-repository.interface';
import { DishDto } from '../dtos/create-dish.dto';
import { Dish } from 'src/dish/domain/entities/dish.entity';
@Injectable()
export class CreateDishUseCase {
  private readonly logger = new Logger(CreateDishUseCase.name);
  constructor(
    @Inject(DishRepositoryName)
    private readonly dishRepositorty: IDishRepository,
  ) {}
  async execute(createDto: DishDto, pathImage?: string): Promise<Dish> {
    try {
      const dishs = await this.dishRepositorty.create({
        name: createDto.name,
        description: createDto.description,
        category: createDto.category,
        image: pathImage,
      });
      return dishs;
    } catch (error) {
      this.logger.error('Failled to create dish', error.stack);
      throw new BadRequestException('Failed to create dish', {
        cause: error,
        description: error.message,
      });
    }
  }
}
