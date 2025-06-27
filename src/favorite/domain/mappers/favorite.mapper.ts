import { CreateFavoriteDto } from 'src/favorite/application/dtos/create-favorite.dto';
import { Favorite } from '../entities/favorite-entity';
import { Prisma, Favorite as prismaEntity } from '@prisma/client';
import { UpdateFavoriteDto } from 'src/favorite/application/dtos/update-favorite.dto';
export class FavoriteMapper {
  toEntity(prismaModel: prismaEntity): Favorite {
    return new Favorite(
      prismaModel.id,
      prismaModel.userId,
      prismaModel.restaurantId,
      prismaModel.createdAt,
    );
  }
  toPersistence(createDto: CreateFavoriteDto): Prisma.FavoriteCreateInput {
    return {
      user: { connect: { id: createDto.userId } },
      restaurant: { connect: { id: createDto.restaurantId } },
    };
  }
  toUpdate(updateDto: UpdateFavoriteDto): Prisma.FavoriteUpdateInput {
    const dataFavorite: Prisma.FavoriteUpdateInput = {};
    if (updateDto.userId !== undefined) {
      dataFavorite.user = { connect: { id: updateDto.userId } };
    }
    if (updateDto.restaurantId !== undefined) {
      dataFavorite.restaurant = { connect: { id: updateDto.restaurantId } };
    }
    return dataFavorite;
  }
}
