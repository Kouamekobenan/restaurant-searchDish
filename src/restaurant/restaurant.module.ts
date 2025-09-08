import { Injectable, Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { RestaurantController } from './presentation/restaurant.controller';
import { CreateRestaurantUseCase } from './application/usecases/create-restaurant.usecase';
import { RestaurantRepositoryName } from './domain/interfaces/restaurant.interface';
import { RestaurantRepository } from './infrastructure/restaurant-repository.impl';
import { RestaurantMapper } from './domain/mappers/restaurant-mapper.mapper';
import { UpdateRestaurantUseCase } from './application/usecases/update-restaurant.useCase';
import { PaginationRestaurantUseCase } from './application/usecases/pagination-restaurant.usecase';
import { GetAllRestaurantUseCase } from './application/usecases/getAll-restaurant.usecase';
import { DeleteRestaurantUseCase } from './application/usecases/delete-restaurant.usecase';
import { FindRestaurantByIdUseCase } from './application/usecases/find-restaurant-byId.usecase';
import { DeactivateRestaurantUseCase } from './application/usecases/deactivate-restaurant.usecase';
import { ActivateRestaurantUseCase } from './application/usecases/activate-restaurant.usecase';
import { FileUploaderName } from 'src/cloudinary/file-upload.interface';
import { CloudinaryService } from 'src/cloudinary/claudinary.service';

@Module({
  imports: [],

  controllers: [RestaurantController],
  providers: [
    // serviec
    PrismaService,

    // use cases
    CreateRestaurantUseCase,
    UpdateRestaurantUseCase,
    PaginationRestaurantUseCase,
    GetAllRestaurantUseCase,
    DeleteRestaurantUseCase,
    FindRestaurantByIdUseCase,
    DeactivateRestaurantUseCase,
    ActivateRestaurantUseCase,
    {
      provide: RestaurantRepositoryName,
      useClass: RestaurantRepository,
    },
     {
          provide: FileUploaderName,
          useClass: CloudinaryService,
        },

    //   mappers
    RestaurantMapper,
  ],
  exports: [],
})
export class RestaurantModule {}
