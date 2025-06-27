import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  FavoriteRepositoryName,
  IFavoriteRepository,
} from 'src/favorite/domain/interfaces/favorite-repository.interface';

@Injectable()
export class DeleteFavoriteUseCase {
  private logger = new Logger(DeleteFavoriteUseCase.name);
  constructor(
    @Inject(FavoriteRepositoryName)
    private readonly favoriteRepository: IFavoriteRepository,
  ) {}
  async execute(id: string): Promise<boolean> {
    try {
      await this.favoriteRepository.delete(id);
      return true;
    } catch (error) {
      this.logger.error('Failled to delete favorite');
      throw new BadRequestException('Failled to delete favorite', {
        cause: error.cause,
        description: error.message,
      });
    }
  }
}
