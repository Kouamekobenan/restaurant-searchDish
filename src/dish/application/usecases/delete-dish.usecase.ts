import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  DishRepositoryName,
  IDishRepository,
} from 'src/dish/domain/interfaces/dish-repository.interface';

@Injectable()
export class DeleteDishUseCase {
  private readonly logger = new Logger(DeleteDishUseCase.name);
  constructor(
    @Inject(DishRepositoryName)
    private readonly dishRepository: IDishRepository,
  ) {}
  async execute(id: string): Promise<boolean> {
    try {
      const dish = await this.dishRepository.getById(id);
      if (!dish) {
        throw new NotFoundException('Dish not found');
      }
      await this.dishRepository.delete(id);
      return true;
    } catch (error) {
      this.logger.error('Failled to delete dish', error.message);
      throw new BadRequestException('Failled to delete dish', {
        cause: error,
        description: error.message,
      });
    }
  }
}
