import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IOrderRepository,
  OrderRepositoryName,
} from '../../domain/interfaces/order-repository.interface';
import { Order, OrderStatus } from '../../domain/entities/order.entity';

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @Inject(OrderRepositoryName)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(orderId: string, status: OrderStatus): Promise<Order> {
    const existingOrder = await this.orderRepository.getById(orderId);
    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return await this.orderRepository.updateStatus(orderId, status);
  }
}
