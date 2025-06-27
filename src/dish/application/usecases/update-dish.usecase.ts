import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UpdateDishDto } from '../dtos/update-dish.dto';
import { Dish } from 'src/dish/domain/entities/dish.entity';
import {
  DishRepositoryName,
  IDishRepository,
} from 'src/dish/domain/interfaces/dish-repository.interface';
@Injectable()
export class UpdateDishUseCase {
  private readonly logger = new Logger(UpdateDishUseCase.name);
  constructor(
    @Inject(DishRepositoryName)
    private readonly dishRepository: IDishRepository,
  ) {}
  async execute(id: string, updateDto: UpdateDishDto): Promise<Dish> {
    try {
      return await this.dishRepository.update(id, updateDto);
    } catch (error) {
      this.logger.error('Failled to  update dish', error.stack);
      throw new BadRequestException('Failled to update dish', {
        cause: error,
        description: error.message,
      });
    }
  }
}
