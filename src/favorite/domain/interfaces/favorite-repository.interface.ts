import { CreateFavoriteDto } from 'src/favorite/application/dtos/create-favorite.dto';
import { Favorite } from '../entities/favorite-entity';
import { FavoriteDto } from 'src/favorite/application/dtos/favorite-user.dto';

export const FavoriteRepositoryName = 'IFavoriteRepository';
export interface IFavoriteRepository {
  create(createDto: CreateFavoriteDto): Promise<Favorite>;
  delete(id: string): Promise<void>;
  favoriteUser(userId: string): Promise<FavoriteDto[]>;
}
