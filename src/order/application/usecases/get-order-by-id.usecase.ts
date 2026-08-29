import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import {
  IOrderRepository,
  OrderRepositoryName,
} from 'src/order/domain/interfaces/order-repository.interface';
import { Order } from 'src/order/domain/entities/order.entity';

@Injectable()
export class GetOrderByIdUseCase {
  constructor(
    @Inject(OrderRepositoryName)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(userId: string, orderId: string): Promise<Order> {
    const order = await this.orderRepository.getById(orderId);
    if (order.getUserId() !== userId) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette commande');
    }
    return order;
  }
}
