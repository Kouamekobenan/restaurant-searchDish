import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RestaurantDishModule } from 'src/restaurantDish/restaurantDish.module';
import { OrderController } from './presentation/order.controller';
import { OrderRepositoryName } from './domain/interfaces/order-repository.interface';
import { OrderRepository } from './infrastructure/order-repository.impl';
import { OrderMapper } from './domain/mappers/order.mapper';
import { CreateOrderUseCase } from './application/usecases/create-order.usecase';
import { GetOrderByIdUseCase } from './application/usecases/get-order-by-id.usecase';
import { ListOrdersByUserUseCase } from './application/usecases/list-orders-by-user.usecase';

@Module({
  imports: [RestaurantDishModule],
  controllers: [OrderController],
  providers: [
    PrismaService,
    CreateOrderUseCase,
    GetOrderByIdUseCase,
    ListOrdersByUserUseCase,
    {
      provide: OrderRepositoryName,
      useClass: OrderRepository,
    },
    OrderMapper,
  ],
  exports: [OrderRepositoryName],
})
export class OrderModule {}
