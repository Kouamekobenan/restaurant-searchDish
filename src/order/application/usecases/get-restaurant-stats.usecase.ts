import { Inject, Injectable } from '@nestjs/common';
import {
  IOrderRepository,
  OrderRepositoryName,
  RestaurantStats,
} from '../../domain/interfaces/order-repository.interface';

@Injectable()
export class GetRestaurantStatsUseCase {
  constructor(
    @Inject(OrderRepositoryName)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(restaurantId: string): Promise<RestaurantStats> {
    return await this.orderRepository.getRestaurantStats(restaurantId);
  }
}
