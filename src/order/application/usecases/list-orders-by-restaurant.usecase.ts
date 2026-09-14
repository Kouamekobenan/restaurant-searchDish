import { Inject, Injectable } from '@nestjs/common';
import {
  IOrderRepository,
  OrderRepositoryName,
  PaginatedOrders,
} from '../../domain/interfaces/order-repository.interface';

@Injectable()
export class ListOrdersByRestaurantUseCase {
  constructor(
    @Inject(OrderRepositoryName)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(
    restaurantId: string,
    statusType?: 'ONGOING' | 'COMPLETED',
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedOrders> {
    return await this.orderRepository.paginateByRestaurant(
      restaurantId,
      statusType,
      page,
      limit,
    );
  }
}
