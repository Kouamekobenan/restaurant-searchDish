import { BadRequestException, Injectable } from '@nestjs/common';
import { IDishRepository } from '../domain/interfaces/dish-repository.interface';
import { DishMapper } from '../domain/mapper/dish.mapper';
import { PrismaService } from 'src/prisma/prisma.service';
import { DishDto } from '../application/dtos/create-dish.dto';
import { Dish } from '../domain/entities/dish.entity';
import { UpdateDishDto } from '../application/dtos/update-dish.dto';

@Injectable()
export class DishRepository implements IDishRepository {
  constructor(
    private readonly mapper: DishMapper,
    private readonly prisma: PrismaService,
  ) {}
  async create(createDto: DishDto): Promise<Dish> {
    try {
      const dishdataDto = this.mapper.toPersistence(createDto);
      const createDish = await this.prisma.dish.create({
        data: dishdataDto,
      });
      return this.mapper.toEntity(createDish);
    } catch (error) {
      throw new BadRequestException('Failled to create dish', {
        cause: error,
        description: error.message,
      });
    }
  }
  async findAll(): Promise<Dish[]> {
    try {
      const dishs = await this.prisma.dish.findMany();
      const allDish = dishs.map((dish) => this.mapper.toEntity(dish));
      return allDish;
    } catch (error) {
      throw new BadRequestException('Failled to retrieve all dish', {
        cause: error,
        description: error.message,
      });
    }
  }
  async pagination(
    page: number,
    limit: number,
  ): Promise<{
    data: Dish[];
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const [dishs, total] = await Promise.all([
        this.prisma.dish.findMany({
          skip: skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.dish.count(),
      ]);
      const dishMap = dishs.map((dish) => this.mapper.toEntity(dish));
      return {
        data: dishMap,
        total,
        totalPage: Math.ceil(total / limit),
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException('Failled to pagination dish', {
        cause: error,
        description: error.message,
      });
    }
  }
  async update(id: string, updateDto: UpdateDishDto): Promise<Dish> {
    try {
      const dishDto = this.mapper.update(updateDto);
      const dishUpdateData = await this.prisma.dish.update({
        where: { id },
        data: dishDto,
      });
      return this.mapper.toEntity(dishUpdateData);
    } catch (error) {
      throw new BadRequestException('Failled to update pagination', {
        cause: error,
        description: error.message,
      });
    }
  }
  async delete(id: string): Promise<void> {
    try {
      await this.prisma.dish.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException('Failled to delete dish bi ID', {
        cause: error,
        description: error.message,
      });
    }
  }
  async getById(id: string): Promise<Dish> {
    try {
      const dish = await this.prisma.dish.findUnique({ where: { id } });
      if (!dish) {
        throw new BadRequestException(`Dish by ID: ${id} not found`);
      }
      const response = this.mapper.toEntity(dish);
      return response;
    } catch (error) {
      throw new BadRequestException('Failled to retrieve dish by ID', {
        cause: error,
        description: error.message,
      });
    }
  }
  async findByName(name: string): Promise<Dish | null> {
    const existingDish = await this.prisma.dish.findFirst({
      where: { name },
    });
    return existingDish ? this.mapper.toEntity(existingDish) : null;
  }
}
