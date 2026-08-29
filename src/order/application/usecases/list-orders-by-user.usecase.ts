import { Inject, Injectable } from '@nestjs/common';
import {
  IOrderRepository,
  OrderRepositoryName,
} from 'src/order/domain/interfaces/order-repository.interface';
import { Order } from 'src/order/domain/entities/order.entity';

@Injectable()
export class ListOrdersByUserUseCase {
  constructor(
    @Inject(OrderRepositoryName)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{
    data: Order[];
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  }> {
    return await this.orderRepository.paginateByUser(userId, page, limit);
  }
}
