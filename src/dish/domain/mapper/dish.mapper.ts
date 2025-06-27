import { DishDto } from 'src/dish/application/dtos/create-dish.dto';
import { Dish } from '../entities/dish.entity';
import { Prisma, Dish as PrismaEntity } from '@prisma/client';
import { UpdateDishDto } from 'src/dish/application/dtos/update-dish.dto';

export class DishMapper {
  toEntity(prismaModel: PrismaEntity): Dish {
    return new Dish(
      prismaModel.id,
      prismaModel.name,
      prismaModel.description,
      prismaModel.category,
      prismaModel.createdAt,
      prismaModel.updatedAt,
    );
  }

  toPersistence(createDto: DishDto): Prisma.DishCreateInput {
    return {
      name: createDto.name,
      description: createDto.description,
      category: createDto.category,
    };
  }
  update(updateDto :UpdateDishDto):Prisma.DishUpdateInput{
    const dataDish: Prisma.DishUpdateInput={};
    if (updateDto.name !== undefined) {
        dataDish.name =updateDto.name
    }
    if (updateDto.description !== undefined) {
        dataDish.description = updateDto.description
    }
    if (updateDto.category !==undefined) {
        dataDish.category = updateDto.category
    }
    return dataDish
  }
}
