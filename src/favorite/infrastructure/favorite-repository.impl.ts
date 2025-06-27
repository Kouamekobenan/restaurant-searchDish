import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { IFavoriteRepository } from '../domain/interfaces/favorite-repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { FavoriteMapper } from '../domain/mappers/favorite.mapper';
import { CreateFavoriteDto } from '../application/dtos/create-favorite.dto';
import { Favorite } from '../domain/entities/favorite-entity';
import { FavoriteDto } from '../application/dtos/favorite-user.dto';
@Injectable()
export class FavoriteRepository implements IFavoriteRepository {
  private readonly logger = new Logger(FavoriteRepository.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: FavoriteMapper,
  ) {}
  async create(createDto: CreateFavoriteDto): Promise<Favorite> {
    try {
      const favoriteDto = this.mapper.toPersistence(createDto);
      const createFavorite = await this.prisma.favorite.create({
        data: favoriteDto,
      });
      return this.mapper.toEntity(createFavorite);
    } catch (error) {
      this.logger.error(
        'Failled to add that restaurant in your favorites',
        error.stack,
      );
      throw new BadRequestException(
        'Failled to add that restaurant in your favorites',
        {
          cause: error,
          description: error,
        },
      );
    }
  }
  async delete(id: string): Promise<void> {
    try {
      await this.prisma.favorite.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException(
        `Failled to delete favorite restaurant by ID :${id}`,
      );
    }
  }
  async favoriteUser(userId: string): Promise<FavoriteDto[]> {
    try {
      const favorites = await this.prisma.favorite.findMany({
        where: { userId: userId },
        include: {
          restaurant: {
            select: {
              name: true,
            },
          },
          user: {
            select: { name: true },
          },
        },
      });
      const favorite = favorites.map((favorite) => ({
        id: favorite.id,
        nameUser: favorite.user?.name,
        nameRestaurant: favorite.restaurant?.name,
        createdAt: favorite.createdAt,
      }));
      return favorite;
    } catch (error) {
      throw new BadRequestException('Failled to retrieve favorites a user', {
        cause: error,
        description: error,
      });
    }
  }
}
