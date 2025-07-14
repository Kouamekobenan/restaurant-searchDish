import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IRestaurantRepository } from '../domain/interfaces/restaurant.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { RestaurantMapper } from '../domain/mappers/restaurant-mapper.mapper';
import { RestaurantDto } from '../application/dtos/create-restaurant.dto';
import { Restaurant } from '../domain/entities/restaurant.entity';
import { UpdateRestaurantDto } from '../application/dtos/update-restaurant.dto';

@Injectable()
export class RestaurantRepository implements IRestaurantRepository {
  private readonly logger = new Logger(RestaurantRepository.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: RestaurantMapper,
  ) {}
  async create(createDto: RestaurantDto): Promise<Restaurant> {
    try {
      const dataToMapper = this.mapper.toPersistence(createDto);
      const newRestaurant = await this.prisma.restaurant.create({
        data: dataToMapper,
      });
      return this.mapper.toEntiy(newRestaurant);
    } catch (error) {
      this.logger.error(
        `Failled to create restaurant ${error.message}: ${error.stack}`,
      );
      throw new BadRequestException('Failled to create restaurant ', {
        cause: error,
        description: error.message,
      });
    }
  }
  async update(
    id: string,
    updateDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    try {
      const updateDataDto = this.mapper.update(updateDto);
      const updateRestaurant = await this.prisma.restaurant.update({
        where: { id },
        data: updateDataDto,
      });
      return this.mapper.toEntiy(updateRestaurant);
    } catch (error) {
      this.logger.error(`Failled to update restaurant`, error.message);
      throw new BadRequestException('Failled to update restaurant', {
        cause: error,
        description: error.message,
      });
    }
  }
  async paginate(
    page: number,
    limit: number,
  ): Promise<{
    data: Restaurant[];
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const [restaurants, total] = await Promise.all([
        this.prisma.restaurant.findMany({
          skip: skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.restaurant.count(),
      ]);
      const allRestaurants = restaurants.map((restaurant) =>
        this.mapper.toEntiy(restaurant),
      );
      return {
        data: allRestaurants,
        total,
        totalPage: Math.ceil(total / limit),
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException('Failled to pagination restaurants', {
        cause: error,
        description: error.message,
      });
    }
  }
  async getAll(): Promise<Restaurant[]> {
    try {
      const restaurants = await this.prisma.restaurant.findMany();
      const allRestau = restaurants.map((restau) =>
        this.mapper.toEntiy(restau),
      );
      return allRestau;
    } catch (error) {
      this.logger.error('Failled to retrieve all restaurants');
      throw new BadRequestException('Failled to retrieve all restaurants', {
        cause: error,
        description: error.message,
      });
    }
  }
  async restauDelete(id: string): Promise<void> {
    try {
      await this.prisma.restaurant.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException('Failled to delete restaurant by ID ', {
        cause: error,
        description: error.message,
      });
    }
  }
  async findById(id: string): Promise<Restaurant> {
    try {
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id },
      });
      if (!restaurant) {
        throw new NotFoundException(`Restaurant with ID:${id} not found`);
      }
      return this.mapper.toEntiy(restaurant);
    } catch (error) {
      this.logger.error(
        `Failled to retrieve restaurant (ID:${id}) error-${error.message}`,
      );
      throw new BadRequestException(`Failled to retrieve resteurant`, {
        cause: error,
        description: error.message,
      });
    }
  }
  async deactive(id: string): Promise<void> {
    try {
      await this.prisma.restaurant.update({
        where: { id },
        data: { isActive: false },
      });
    } catch (error) {
      this.logger.error(
        `Failled to deactivate restaurant with ID: ${id} error-${error.message}`,
      );
      throw new BadRequestException('Failled to deactivate restaurant', {
        cause: error,
        description: error.message,
      });
    }
  }

  async active(id: string): Promise<void> {
    try {
      await this.prisma.restaurant.update({
        where: { id },
        data: { isActive: true },
      });
    } catch (error) {
      this.logger.error(
        `Failled to activate restaurant with ID: ${id} error-${error.message}`,
      );
      throw new BadRequestException('Failled to activate restaurant', {
        cause: error,
        description: error.message,
      });
    }
  }
}
