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
export class GetAllFavoriteUserUseCase {
  private readonly logger = new Logger(GetAllFavoriteUserUseCase.name);
  constructor(
    @Inject(FavoriteRepositoryName)
    private readonly favoriteRepository: IFavoriteRepository,
  ) {}
  async execute(userId: string) {
    try {
      return await this.favoriteRepository.favoriteUser(userId);
    } catch (error) {
      this.logger.error('Failled to retrieve favorite a user', error);
      throw new BadRequestException('Failled to retrieve favorite a user', {
        cause: error,
        description: error.message,
      });
    }
  }
}
