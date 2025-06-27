import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FavoriteController } from './presentation/favorite.controller';
import { FavoriteRepositoryName } from './domain/interfaces/favorite-repository.interface';
import { FavoriteRepository } from './infrastructure/favorite-repository.impl';
import { FavoriteMapper } from './domain/mappers/favorite.mapper';
import { CreateFavoriteUseCase } from './application/usecases/create-favorite.usecase';
import { DeleteFavoriteUseCase } from './application/usecases/delete-favorite.usecase';
import { GetAllFavoriteUserUseCase } from './application/usecases/getAllFavoriteUser.usecase';
@Module({
  imports: [],
  controllers: [FavoriteController],
  providers: [
    // serviec
    PrismaService,
    // use cases
    CreateFavoriteUseCase,
    DeleteFavoriteUseCase,
    GetAllFavoriteUserUseCase,
    {
      provide: FavoriteRepositoryName,
      useClass: FavoriteRepository,
    },
    //   mappers
    FavoriteMapper,
  ],
  exports: [FavoriteRepositoryName],
})
export class FavoriteModule {}
