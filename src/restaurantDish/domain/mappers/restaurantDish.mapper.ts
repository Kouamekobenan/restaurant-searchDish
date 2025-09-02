import { CreateRestaurantDishDto } from 'src/restaurantDish/application/dtos/create-restaurantDishDto';
import { RestaurantDish } from '../entities/restaurantDish.entity';
import { Prisma, RestaurantDish as prismaEntity } from '@prisma/client';
import { UpdateRestaurantDishDto } from 'src/restaurantDish/application/dtos/update-restaurantDish';

export class RestaurantDishMapper {
  toEntity(prismaModel: any): RestaurantDish {
    return new RestaurantDish(
      prismaModel.id,
      prismaModel.restaurantId,
      prismaModel.dishId,
      prismaModel.price,
      prismaModel.currency,
      prismaModel.description,
      prismaModel.isAvailable,
      prismaModel.createdAt,
      prismaModel.updatedAt,
      prismaModel.dish,
      prismaModel.restaurant,
    );
  }
  toPersistence(
    createRestDish: CreateRestaurantDishDto,
  ): Prisma.RestaurantDishCreateInput {
    return {
      restaurant: { connect: { id: createRestDish.restaurantId } },
      dish: { connect: { id: createRestDish.dishId } },
      price: createRestDish.price,
      currency: createRestDish.currency,
      description: createRestDish.description,
      isAvailable: createRestDish.isAvailable,
    };
  }
  toUpdate(
    updateRestauDish: UpdateRestaurantDishDto,
  ): Prisma.RestaurantDishUpdateInput {
    const dataRestDish: Prisma.RestaurantDishUpdateInput = {};
    if (updateRestauDish.restaurantId !== undefined) {
      dataRestDish.restaurant = {
        connect: { id: updateRestauDish.restaurantId },
      };
    }
    if (updateRestauDish.dishId !== undefined) {
      dataRestDish.dish = { connect: { id: updateRestauDish.dishId } };
    }
    if (updateRestauDish.price !== undefined) {
      dataRestDish.price = updateRestauDish.price;
    }
    if (updateRestauDish.currency !== undefined) {
      dataRestDish.currency = updateRestauDish.currency;
    }
    if (updateRestauDish.description !== undefined) {
      dataRestDish.description = updateRestauDish.description;
    }
    if (updateRestauDish.isAvailable !== undefined) {
      dataRestDish.isAvailable = updateRestauDish.isAvailable;
    }
    return dataRestDish;
  }
}
