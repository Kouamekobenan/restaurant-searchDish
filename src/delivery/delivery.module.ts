import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeliveryController } from './delivery.controller';
import { CreateDeliveryUserUseCase } from './usecases/create-delivery-user.usecase';
import { ListDeliveryUsersUseCase } from './usecases/list-delivery-users.usecase';

@Module({
  controllers: [DeliveryController],
  providers: [
    PrismaService,
    CreateDeliveryUserUseCase,
    ListDeliveryUsersUseCase,
  ],
  exports: [],
})
export class DeliveryModule {}
