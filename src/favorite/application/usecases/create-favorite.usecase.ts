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
import { CreateFavoriteDto } from '../dtos/create-favorite.dto';
import { Favorite } from 'src/favorite/domain/entities/favorite-entity';

@Injectable()
export class CreateFavoriteUseCase {
  private readonly logger = new Logger(CreateFavoriteUseCase.name);
  constructor(
    @Inject(FavoriteRepositoryName)
    private readonly favoriteRepository: IFavoriteRepository,
  ) {}
  async execute(createDto: CreateFavoriteDto): Promise<Favorite> {
    try {
      const createFavorite = await this.favoriteRepository.create(createDto);
      return createFavorite;
    } catch (error) {
      this.logger.error(
        `Failled to add restaurant in your favorite ${error.stack}`,
      );
      throw new BadRequestException(
        'Failled to add restaurant in your favorite',
        {
          cause: error,
          description: error.message,
        },
      );
    }
  }
}
