import { Injectable, Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { RestaurantDishController } from './presentation/restaurantDish.controller';
import { RestaurantDishRepositoryName } from './domain/interfaces/dishRestaurant-repository.interface';
import { RestaurantDishRepository } from './infrastructure/restaurantDish-repository.impl';
import { RestaurantDishMapper } from './domain/mappers/restaurantDish.mapper';
import { CreateRestaurantDishUseCase } from './application/usecases/create-restaurantDish.usecase';
import { UpdateRestaurantDisuUseCase } from './application/usecases/update-restaurantdish.usecase';
import { GetRestaurantDishUseCase } from './application/usecases/get-restaurantDish-byID';
import { PaginationDishUseCase } from './application/usecases/restaurantDish.usecase';
import { FindAllRestaurantDishUseCase } from './application/usecases/find-all-restaurantDish.usecase';
import { DeleteRestaurantDishUseCase } from './application/usecases/delete-restaurantdish.usecase';
import { FilterRestaurantUseCase } from './application/usecases/filter-restaurant.usecase';
import { FindDishbyRestaurantByIdUseCase } from './application/usecases/dish-restaurantById';

@Module({
  imports: [],

  controllers: [RestaurantDishController],
  providers: [
    // serviec
    PrismaService,
    // use cases
    CreateRestaurantDishUseCase,
    UpdateRestaurantDisuUseCase,
    GetRestaurantDishUseCase,
    PaginationDishUseCase,
    FindAllRestaurantDishUseCase,
    DeleteRestaurantDishUseCase,
    FilterRestaurantUseCase,
    FindDishbyRestaurantByIdUseCase,
    {
      provide: RestaurantDishRepositoryName,
      useClass: RestaurantDishRepository,
    },

    //   mappers
    RestaurantDishMapper,
  ],
  exports: [],
})
export class RestaurantDishModule {}
