import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IRestaurantDishRepository } from '../domain/interfaces/dishRestaurant-repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { RestaurantDishMapper } from '../domain/mappers/restaurantDish.mapper';
import { CreateRestaurantDishDto } from '../application/dtos/create-restaurantDishDto';
import { RestaurantDish } from '../domain/entities/restaurantDish.entity';
import { UpdateRestaurantDishDto } from '../application/dtos/update-restaurantDish';
import { connect } from 'http2';
import { RestaurantDishWithNamesDto } from '../application/dtos/search-restau.dto';

@Injectable()
export class RestaurantDishRepository implements IRestaurantDishRepository {
  private readonly logger = new Logger(RestaurantDishRepository.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: RestaurantDishMapper,
  ) {}
  async create(createDto: CreateRestaurantDishDto): Promise<RestaurantDish> {
    try {
      const restaurantDishDto = this.mapper.toPersistence(createDto);
      const createRestaurantDish = await this.prisma.restaurantDish.create({
        data: restaurantDishDto,
      });
      return this.mapper.toEntity(createRestaurantDish);
    } catch (error) {
      this.logger.error('Failled to create restaurant dish');
      throw new BadRequestException('Failled to create restaurant dish', {
        cause: error,
        description: error.message,
      });
    }
  }
  async update(
    id: string,
    updateDto: UpdateRestaurantDishDto,
  ): Promise<RestaurantDish> {
    try {
      const restaurantDishDto = this.mapper.toUpdate(updateDto);
      const updateRestaurantDish = await this.prisma.restaurantDish.update({
        where: { id },
        data: restaurantDishDto,
      });
      return this.mapper.toEntity(updateRestaurantDish);
    } catch (error) {
      this.logger.error('Failled to update restaurant dish', error.stack);
      throw new BadRequestException('Failled to update restaurant dish', {
        cause: error,
        description: error.message,
      });
    }
  }
  async getId(id: string): Promise<RestaurantDish> {
    try {
      const restaurantDish = await this.prisma.restaurantDish.findUnique({
        where: { id },
      });
      if (!restaurantDish) {
        throw new NotFoundException(
          `Restaurant dish with by ID :${id} not found`,
        );
      }
      return this.mapper.toEntity(restaurantDish);
    } catch (error) {
      throw new BadRequestException(
        'Failled to retrieve restaurant dish by ID',
        {
          cause: error,
          description: error.message,
        },
      );
    }
  }
  async pagination(
    page: number,
    limit: number,
  ): Promise<{
    data: RestaurantDish[];
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const [restaurantDishs, total] = await Promise.all([
        this.prisma.restaurantDish.findMany({
          skip: skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.restaurantDish.count(),
      ]);
      const restaurantDishMap = restaurantDishs.map((restaurantdish) =>
        this.mapper.toEntity(restaurantdish),
      );
      return {
        data: restaurantDishMap,
        total,
        totalPage: Math.ceil(total / limit),
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(`Failled to pagination restaurant dish ${error.stack}`);
      throw new BadRequestException('Failled to pagination restaurant dish ', {
        cause: error,
        description: error.message,
      });
    }
  }
  async getAll(): Promise<RestaurantDish[]> {
    try {
      const restaurantDish = await this.prisma.restaurantDish.findMany();
      const restaurantDishMap = restaurantDish.map((restau) =>
        this.mapper.toEntity(restau),
      );
      return restaurantDishMap;
    } catch (error) {
      this.logger.error('Failled to retrieve restaurant dish');
      throw new BadRequestException('Failled to retrieve restaurant dish', {
        cause: error,
        description: error.message,
      });
    }
  }
  async delete(id: string): Promise<void> {
    try {
      await this.prisma.restaurantDish.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException('Failled to delete restaurant dish', {
        cause: error,
        description: error.message,
      });
    }
  }

  async search(
    page: number,
    limit: number,
    dishName: string, // ✅ nom du plat, pas l'ID
  ): Promise<{
    data: RestaurantDishWithNamesDto[];
    total: number;
    totalPage: number;
    page: number;
    limit: number;
   
  }> {
    try {
      const skip = (page - 1) * limit;

      const where: any = {};

      if (dishName) {
        where.dish = {
          name: {
            contains: dishName,
            mode: 'insensitive',
          },
        };
      }

      const [restaurants, total] = await Promise.all([
        this.prisma.restaurantDish.findMany({
          where,
          include: {
            dish: {
              select: { name: true },
            },
            restaurant: {
              select: { name: true },
            },
          },

          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.restaurantDish.count({ where }), // important
      ]);

      const restauDish = restaurants.map((restau) => ({
        id: restau.id,
        dishName: restau.dish?.name,
        restaurantName: restau.restaurant?.name,
        createdAt: restau.createdAt,
      }));

      return {
        data: restauDish,
        total,
        totalPage: Math.ceil(total / limit),
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException('Failed to filter', {
        cause: error,
        description: error.message,
      });
    }
  }
}
