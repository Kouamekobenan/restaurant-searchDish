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
import { AssignDeliveryUseCase } from './application/usecases/assign-delivery.usecase';
import { UpdateDeliveryStatusUseCase } from './application/usecases/update-delivery-status.usecase';
import { ListOrdersByDeliveryUseCase } from './application/usecases/list-orders-by-delivery.usecase';
import { GetRestaurantStatsUseCase } from './application/usecases/get-restaurant-stats.usecase';
import { ListOrdersByRestaurantUseCase } from './application/usecases/list-orders-by-restaurant.usecase';
import { UpdateOrderStatusUseCase } from './application/usecases/update-order-status.usecase';

@Module({
  imports: [RestaurantDishModule],
  controllers: [OrderController],
  providers: [
    PrismaService,
    CreateOrderUseCase,
    GetOrderByIdUseCase,
    ListOrdersByUserUseCase,
    AssignDeliveryUseCase,
    UpdateDeliveryStatusUseCase,
    ListOrdersByDeliveryUseCase,
    GetRestaurantStatsUseCase,
    ListOrdersByRestaurantUseCase,
    UpdateOrderStatusUseCase,
    {
      provide: OrderRepositoryName,
      useClass: OrderRepository,
    },
    OrderMapper,
  ],
  exports: [OrderRepositoryName],
})
export class OrderModule {}
