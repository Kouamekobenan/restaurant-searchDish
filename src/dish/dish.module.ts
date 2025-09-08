import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { DishController } from './presentation/dish.controller';
import { CreateDishUseCase } from './application/usecases/create-dish.usecase';
import { DishRepositoryName } from './domain/interfaces/dish-repository.interface';
import { DishRepository } from './infrastructure/dish-repository.impl';
import { DishMapper } from './domain/mapper/dish.mapper';
import { FindallDishUseCase } from './application/usecases/findAll-dish.usecase';
import { PaginationDishUseCase } from './application/usecases/pagination-dish.usecase';
import { UpdateDishUseCase } from './application/usecases/update-dish.usecase';
import { DeleteDishUseCase } from './application/usecases/delete-dish.usecase';
import {  GetDishByIdUseCase } from './application/usecases/get-dish-byId.usecase';
import { FileUploaderName } from 'src/cloudinary/file-upload.interface';
import { CloudinaryService } from 'src/cloudinary/claudinary.service';

@Module({
  imports: [],

  controllers: [DishController],
  providers: [
    // serviec
    PrismaService,

    // use cases
    CreateDishUseCase,
    FindallDishUseCase,
    PaginationDishUseCase,
    UpdateDishUseCase,
    DeleteDishUseCase,
    GetDishByIdUseCase,
    {
      provide: DishRepositoryName,
      useClass: DishRepository,
    },
    {
      provide: FileUploaderName,
      useClass: CloudinaryService,
    },

    //   mappers
    DishMapper,
  ],
  exports: [],
})
export class DishModule {}
